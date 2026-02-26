import { IsEmail, IsString, MinLength, IsEnum, IsNotEmpty } from 'class-validator';
import { UserRole } from '@prisma/client';

export class RegisterDto {
  @IsEnum(UserRole, { message: 'Cargo inválido' })
  @IsNotEmpty()
  role: UserRole;

  @IsEmail({}, { message: 'E-mail inválido' })
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  password: string;
}