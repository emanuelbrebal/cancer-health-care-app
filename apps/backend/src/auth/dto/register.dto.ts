import { IsEmail, IsString, MinLength, IsEnum, IsNotEmpty, IsOptional, IsIn } from 'class-validator';
import { UserRole } from '@prisma/client';

const ALLOWED_ROLES: UserRole[] = [UserRole.PATIENT, UserRole.CAREGIVER];

export class RegisterDto {
  @IsEnum(UserRole, { message: 'Tipo de conta inválido.' })
  @IsIn(ALLOWED_ROLES, { message: 'Tipo de conta não permitido no cadastro.' })
  @IsNotEmpty({ message: 'Forneça o tipo da sua conta.' })
  role: UserRole;

  @IsOptional()
  @IsString()
  name?: string;

  @IsEmail({}, { message: 'Forneça um e-mail válido.' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'A senha é obrigatória.' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  password: string;
}