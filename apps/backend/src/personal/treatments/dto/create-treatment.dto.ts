import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class CreateTreatmentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  frequency: string;

  @IsString()
  @IsNotEmpty()
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
