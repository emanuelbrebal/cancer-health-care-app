import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { UsersRepository } from 'src/user/user.repository';

@Injectable()
export class BooksService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findAll() {
    const users = await this.usersRepository.findAll();
    if(!users) throw new NotFoundException('Nenhum usuário cadastrado.');
    return this.usersRepository.findAll();
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findById(id);
    if (!user) throw new NotFoundException('Usuário não encontrado.');
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id); 
    if(!user) throw new NotFoundException('Nenhum usuário encontrado.');
    return this.usersRepository.update(id, updateUserDto);
  }

  async remove(id: string) {
    const user = await this.findOne(id); 
    if(!user) throw new NotFoundException('Nenhum usuário encontrado.');
    return this.usersRepository.delete(id);
  }
}