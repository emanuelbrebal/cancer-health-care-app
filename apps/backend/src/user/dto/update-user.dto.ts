import { IsDate, IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole, PronounEnum } from '@prisma/client';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'E-mail inválido' })
  email?: string;

  @IsOptional()
  @IsEnum(PronounEnum)
  pronoun?: PronounEnum;

  @IsOptional()
  @IsString()
  phone_number?: string;

  @IsOptional()
  @IsString()
  profile_picture?: string;

  @IsOptional()
  @IsDate()
  birthday?: string;
}