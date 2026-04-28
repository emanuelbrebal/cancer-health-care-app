import { IsDate, IsEmail, IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Type } from 'class-transformer';
import { PronounEnum } from '@prisma/client';

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
  @MaxLength(20)
  phone_number?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000000)
  profile_picture?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  birthday?: Date;
}