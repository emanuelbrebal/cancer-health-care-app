import {
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ForbiddenException,
  Query,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteAccountDto } from './dto/delete-account.dto';
import { Throttle } from '@nestjs/throttler';
import { UserMapper } from './user.mapper';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UsersService } from './user.service';
import { UserRole } from '@prisma/client';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import type { AuthenticatedRequest } from 'src/auth/types/authenticated-request';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  async findAll(@Query('limit') limit?: string) {
    const take = limit ? Math.min(parseInt(limit, 10) || 100, 500) : 100;
    const users = await this.usersService.findAll(take);
    return users.map((u) => UserMapper.toDto(u));
  }

  @Post('me/suspend')
  @HttpCode(HttpStatus.OK)
  async suspend(@Req() req: AuthenticatedRequest) {
    return this.usersService.suspend(req.user.userId);
  }

  // Exclusão definitiva pelo próprio titular, com confirmação de senha.
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Delete('me')
  async removeMe(
    @Req() req: AuthenticatedRequest,
    @Body() dto: DeleteAccountDto,
  ) {
    await this.usersService.removeOwn(req.user.userId, dto.password);
    return { message: 'Conta e dados excluídos.' };
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    if (req.user.userId !== id && req.user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Sem permissão para ver este usuário.');
    }
    const user = await this.usersService.findOne(id);
    return UserMapper.toDto(user);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: AuthenticatedRequest,
  ) {
    if (req.user.userId !== id && req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Sem permissão para editar este usuário.');
    }
    const user = await this.usersService.update(id, updateUserDto);
    return UserMapper.toDto(user);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    await this.usersService.removeByAdmin(id, req.user.userId);
    return { message: 'Usuário removido com sucesso' };
  }
}
