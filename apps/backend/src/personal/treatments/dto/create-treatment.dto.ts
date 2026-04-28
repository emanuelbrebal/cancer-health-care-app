import { IsString, IsNotEmpty, IsOptional, IsDateString, Matches } from 'class-validator';

export class CreateTreatmentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  frequency: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{2}:\d{2}$/, { message: 'startTime deve estar no formato HH:MM' })
  startTime: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsString()
  doctorName?: string;

  @IsOptional()
  @IsString()
  doctorContact?: string;

  @IsOptional()
  @IsString()
  hospitalName?: string;
}
