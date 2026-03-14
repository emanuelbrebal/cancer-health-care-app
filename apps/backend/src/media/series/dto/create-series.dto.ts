import { IsString, IsOptional, MaxLength, IsInt, IsUrl } from 'class-validator';

import { CreateMediaDto } from "src/media/common/dto/CreateMediaDto";

export class CreateSeriesDto extends CreateMediaDto {
    @IsOptional()
    @IsString()
    @MaxLength(100)
    showrunner: string;

    @IsOptional()
    @IsUrl()
    @IsString()
    externalLink?: string;

    @IsOptional()
    @IsInt()
    seasons?: number;

    @IsOptional()
    @IsInt()
    episodes?: number;
}
