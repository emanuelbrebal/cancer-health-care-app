// apps/backend/src/leisures/dto/create-leisure.dto.ts
import { IsString, IsEnum, MaxLength, IsNotEmpty, IsOptional } from 'class-validator';
import { LeisureType, FrequencyType } from '@prisma/client'; 

export class CreateLeisureDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    name: string;

    @IsEnum(LeisureType, { message: 'Tipo de atividade inválido' })
    type: LeisureType;

    @IsEnum(FrequencyType, { message: 'Frequência inválida' })
    frequency: FrequencyType;

    @IsString()
    @IsOptional()
    image_path: string;
}