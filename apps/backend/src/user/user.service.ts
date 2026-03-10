import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './user.repository';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findAll() {
    const users = await this.usersRepository.findAll();
    if(!users || users.length === 0) throw new NotFoundException('Nenhum usuário cadastrado.');
    return users;
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findById(id);
    if (!user) throw new NotFoundException('Usuário não encontrado.');
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id); 
    return this.usersRepository.update(id, updateUserDto);
  }

  async remove(id: string) {
    await this.findOne(id); 
    return this.usersRepository.delete(id);
  }
}