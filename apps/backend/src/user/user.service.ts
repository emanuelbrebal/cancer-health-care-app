import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './user.repository';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly prisma: PrismaService,
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
      const existing = await this.prisma.user.findUnique({ where: { email: updateUserDto.email } });
      if (existing && existing.id !== id) {
        throw new ConflictException('Este e-mail já está em uso.');
      }
    }
    return this.usersRepository.update(id, updateUserDto);
  }

  async remove(id: string, reason?: string) {
    const user = await this.findOne(id);
    await this.prisma.userDeletionLog.create({
      data: {
        userId: user.id,
        email: user.email,
        role: user.role,
        name: user.name ?? null,
        reason: reason ?? null,
      },
    });
    return this.usersRepository.delete(id);
  }
}