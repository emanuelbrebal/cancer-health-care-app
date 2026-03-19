import { IsString, IsNotEmpty, MaxLength, IsOptional, IsArray } from 'class-validator';

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
}