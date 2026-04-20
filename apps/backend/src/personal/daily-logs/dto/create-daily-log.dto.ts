import { IsString, IsNotEmpty, MaxLength, IsOptional, IsArray, Matches } from 'class-validator';

export class CreateDailyLogDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  content: string;

  @IsArray()
  @IsOptional()
  emotes?: string[];

  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'date deve estar no formato YYYY-MM-DD' })
  date?: string;
}