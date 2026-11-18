import { Injectable } from '@nestjs/common';
import { ConsentPurpose } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export interface ConsentState {
  purpose: ConsentPurpose;
  granted: boolean;
  termVersion: string;
  updatedAt: Date | null;
}

// Consentimento LGPD: negado por padrão, por finalidade, com histórico.
@Injectable()
export class ConsentService {
  constructor(private readonly prisma: PrismaService) {}

  get termVersion() {
    return process.env.CONSENT_TERM_VERSION?.trim() || '1.0';
  }

  private latest(userId: string, purpose: ConsentPurpose) {
    return this.prisma.consentRecord.findFirst({
      where: { userId, purpose },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Aceite dado em versão anterior do termo não vale para a versão atual.
  async isGranted(userId: string, purpose: ConsentPurpose) {
    const record = await this.latest(userId, purpose);
    return !!record?.granted && record.termVersion === this.termVersion;
  }

  async getState(userId: string): Promise<ConsentState[]> {
    return Promise.all(
      Object.values(ConsentPurpose).map(async (purpose) => {
        const record = await this.latest(userId, purpose);
        return {
          purpose,
          granted: !!record?.granted && record.termVersion === this.termVersion,
          termVersion: this.termVersion,
          updatedAt: record?.createdAt ?? null,
        };
      }),
    );
  }

  async set(userId: string, purpose: ConsentPurpose, granted: boolean) {
    if ((await this.isGranted(userId, purpose)) !== granted) {
      await this.prisma.consentRecord.create({
        data: { userId, purpose, granted, termVersion: this.termVersion },
      });
    }
    return this.getState(userId);
  }

  history(userId: string) {
    return this.prisma.consentRecord.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        purpose: true,
        granted: true,
        termVersion: true,
        createdAt: true,
      },
    });
  }
}
