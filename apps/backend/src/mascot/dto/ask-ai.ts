import { IsString, IsNotEmpty, IsObject, IsOptional } from 'class-validator';

export class AskAiDto {
  @IsString() @IsNotEmpty()
  userId: string;

  @IsString() @IsNotEmpty()
  userQuestion: string;

  @IsObject()
  @IsOptional()
  calendarData: any; 

  @IsObject()
  @IsOptional()
  treatmentData: any; 
}