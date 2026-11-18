import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './user.repository';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { SessionService } from '../auth/session.service';
import { pseudonymize } from '../shared/utils/pseudonym.util';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly prisma: PrismaService,
    private readonly sessionService: SessionService,
  ) {}

  async findAll(take = 100) {
    return this.usersRepository.findAll(take);
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findById(id);
    if (!user) throw new NotFoundException('Usuário não encontrado.');
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);
    if (updateUserDto.email) {
      const existing = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException('Este e-mail já está em uso.');
      }
    }
    return this.usersRepository.update(id, updateUserDto);
  }

  // Suspensão: bloqueia o login e encerra as sessões; nenhum dado é apagado.
  async suspend(id: string) {
    await this.findOne(id);
    await this.prisma.user.update({
      where: { id },
      data: { status: 'INACTIVE', suspendedAt: new Date() },
    });
    await this.sessionService.revokeAllForUser(id);
    return { message: 'Acesso suspenso. Seus dados continuam guardados.' };
  }

  // Exclusão definitiva: apaga a conta e todos os dados do titular. Diário, tratamentos,
  // consentimentos e sessões saem por cascade; conversas do mascote e auditoria não têm
  // relação com User e são tratadas aqui. Fica só um registro pseudonimizado da exclusão.
  async remove(id: string, reason?: string) {
    const user = await this.findOne(id);
    const userRef = pseudonymize(user.id);

    await this.prisma.$transaction([
      this.prisma.patientSupportLog.deleteMany({
        where: { userId: { in: [user.id, userRef] } },
      }),
      this.prisma.dailyLogAudit.updateMany({
        where: { userId: user.id },
        data: { userId: userRef },
      }),
      this.prisma.userDeletionLog.create({
        data: { userRef, role: user.role, reason: reason ?? null },
      }),
      this.prisma.user.delete({ where: { id: user.id } }),
    ]);
  }
}
