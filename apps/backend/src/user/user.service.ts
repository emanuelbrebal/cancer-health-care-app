import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
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
  // Exclusão pelo próprio titular: exige a senha atual, para que um token vazado não apague a conta.
  // 403 (e não 401) para o app não tratar senha errada como sessão expirada.
  async removeOwn(id: string, password: string) {
    const user = await this.findOne(id);
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new ForbiddenException({
        message: 'Senha incorreta.',
        code: 'INVALID_PASSWORD',
      });
    }
    await this.remove(id, 'Solicitada pelo titular');
  }

  // Exclusão pelo painel (W04-7): o ADMIN nunca exclui a própria conta (403) e o sistema
  // não fica sem nenhuma conta ADMIN ativa (409).
  async removeByAdmin(id: string, actorId: string) {
    if (id === actorId) {
      throw new ForbiddenException({
        message: 'Você não pode excluir a sua própria conta pelo painel.',
        code: 'SELF_DELETE_FORBIDDEN',
      });
    }
    const user = await this.findOne(id);
    if (user.role === 'ADMIN' && user.status === 'ACTIVE') {
      const activeAdmins = await this.prisma.user.count({
        where: { role: 'ADMIN', status: 'ACTIVE' },
      });
      if (activeAdmins <= 1) {
        throw new ConflictException({
          message:
            'Não é possível excluir a última conta de administrador ativa.',
          code: 'LAST_ADMIN',
        });
      }
    }
    await this.remove(id, 'Removida por administrador');
  }

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
