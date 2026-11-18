import { Injectable, UnauthorizedException } from '@nestjs/common';
import { createHash, randomBytes, randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

const DAY_MS = 24 * 60 * 60 * 1000;

// Sessão persistente por refresh token rotativo com janela deslizante.
@Injectable()
export class SessionService {
  constructor(private readonly prisma: PrismaService) {}

  private get ttlMs() {
    const days = Number(process.env.REFRESH_TTL_DAYS);
    return (Number.isFinite(days) && days > 0 ? days : 7) * DAY_MS;
  }

  private hash(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  async issue(userId: string, familyId: string = randomUUID()) {
    const token = randomBytes(48).toString('base64url');
    await this.prisma.refreshToken.create({
      data: {
        userId,
        familyId,
        tokenHash: this.hash(token),
        expiresAt: new Date(Date.now() + this.ttlMs),
      },
    });
    return token;
  }

  async rotate(token: string) {
    const invalid = new UnauthorizedException(
      'Sessão expirada. Entre novamente.',
    );
    const current = await this.prisma.refreshToken.findUnique({
      where: { tokenHash: this.hash(token) },
    });
    if (!current) throw invalid;

    // Token já trocado sendo apresentado de novo indica cópia: encerra a família inteira.
    if (current.revokedAt) {
      await this.revokeFamily(current.familyId);
      throw invalid;
    }
    if (current.expiresAt.getTime() <= Date.now()) throw invalid;

    // updateMany condicional: se duas trocas concorrerem, só uma vence.
    const claimed = await this.prisma.refreshToken.updateMany({
      where: { id: current.id, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    if (claimed.count !== 1) {
      await this.revokeFamily(current.familyId);
      throw invalid;
    }

    return {
      userId: current.userId,
      refreshToken: await this.issue(current.userId, current.familyId),
    };
  }

  async revoke(token: string) {
    const current = await this.prisma.refreshToken.findUnique({
      where: { tokenHash: this.hash(token) },
    });
    if (current) await this.revokeFamily(current.familyId);
  }

  async revokeAllForUser(userId: string) {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  private async revokeFamily(familyId: string) {
    await this.prisma.refreshToken.updateMany({
      where: { familyId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}
