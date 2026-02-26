import { IsString, IsEnum, IsOptional, IsInt, IsBoolean, MaxLength, IsArray } from 'class-validator';
import { MediaType, StatusEnum } from '@prisma/client';

export class CreateLeisureDto {
    @IsEnum(MediaType)
    type: MediaType;

    @IsString()
    @MaxLength(150)
    title: string;

    @IsInt()
    @IsOptional()
    releaseYear?: number;

    @IsString()
    genreId: string;

    @IsBoolean()
    isFree: boolean;

    @IsEnum(StatusEnum)
    status: StatusEnum

    @IsOptional()
    @IsArray()
    whereToWatch?: string[];

    // 3. Strategy Book
    @IsOptional()
    @IsString()
    author?: string;

    @IsOptional()
    @IsString()
    eduCapesLink?: string;

    @IsOptional()
    @IsInt()
    visitCount?: 0;

    // 4. Strategy Movie
    @IsOptional()
    @IsString()
    director?: string;

    @IsOptional()
    @IsString()
    externalLink?: string;

    // 5. Strategy TV serie
    @IsOptional()
    @IsString()
    showrunner?: string;

    @IsOptional()
    @IsInt()
    seasons?: number;

}