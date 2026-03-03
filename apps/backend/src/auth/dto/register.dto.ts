import { IsEmail, IsString, MinLength, IsEnum, IsNotEmpty } from 'class-validator';
import { UserRole } from '@prisma/client';

export class RegisterDto {
  @IsEnum(UserRole, { message: 'Tipo de conta inválido.' })
  @IsNotEmpty({message: 'Forneça o tipo da sua conta.'})
  role: UserRole;

  @IsEmail({}, { message: 'Forneça um e-mail válido.' })
  @IsNotEmpty({message: 'O e-mail é obrigatório.'})
  email: string;

  @IsString()
  @IsNotEmpty({message: 'A senha é obrigatória.'})
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  password: string;
}