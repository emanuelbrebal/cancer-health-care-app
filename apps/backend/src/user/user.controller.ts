import { Controller, Get, Body, Patch, Param, Delete, UseGuards, Req, ForbiddenException, Query } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserMapper } from './user.mapper';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UsersService } from './user.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(@Query('limit') limit?: string) {
    const take = limit ? Math.min(parseInt(limit, 10) || 100, 500) : 100;
    const users = await this.usersService.findAll(take);
    return users.map(UserMapper.toDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    return UserMapper.toDto(user);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Req() req: any) {
    if (req.user.userId !== id && req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Sem permissão para editar este usuário.');
    }
    const user = await this.usersService.update(id, updateUserDto);
    return UserMapper.toDto(user);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    if (req.user.userId !== id && req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Sem permissão para remover este usuário.');
    }
    await this.usersService.remove(id);
    return { message: 'Usuário removido com sucesso' };
  }
}
