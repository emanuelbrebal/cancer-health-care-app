import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty({ message: 'O refresh token é obrigatório.' })
  @MaxLength(200)
  refresh_token: string;
}
