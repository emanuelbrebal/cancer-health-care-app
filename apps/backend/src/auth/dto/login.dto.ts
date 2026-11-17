import { IsEmail, IsString, MinLength, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Forneça um e-mail válido.' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  password: string;

  // Confirmação explícita para reativar uma conta suspensa.
  @IsOptional()
  @IsBoolean()
  reactivate?: boolean;
}
