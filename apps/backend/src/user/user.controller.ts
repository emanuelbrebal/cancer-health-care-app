import { Controller, Get, Body, Patch, Param, Delete, UseGuards, NotFoundException, BadRequestException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserMapper } from './user.mapper';
import { UsersRepository } from './user.repository';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private readonly usersRepository: UsersRepository) { }

    @Get()
    async findAll() {
        const users = await this.usersRepository.findAll();
        return users.map((user) => UserMapper.toDto(user));
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const user = await this.usersRepository.findById(id);

        if (!user) {
            throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
        }

        return UserMapper.toDto(user);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        if (!updateUserDto || Object.keys(updateUserDto).length === 0) {
            throw new BadRequestException('Nenhum dado válido fornecido para atualização');
        }
        const user = await this.usersRepository.update(id, updateUserDto);
        return UserMapper.toDto(user);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        await this.usersRepository.delete(id);
        return { message: 'Usuário removido com sucesso' };
    }
}