import { IsString, IsNotEmpty, IsArray, IsOptional, MaxLength } from 'class-validator';

export class AskAiDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  userQuestion: string;

  @IsArray()
  @IsOptional()
  calendarData: any[];

  @IsArray()
  @IsOptional()
  treatmentData: any[];
}