import { IsString, IsOptional, IsUrl } from 'class-validator';
import { CreateMediaDto } from 'src/media/common/dto/CreateMediaDto';

export class CreateMovieDto extends CreateMediaDto {
    @IsString()
    director: string;

    @IsString()
    duration: string;

    @IsOptional()
    @IsUrl()
    externalLink?: string;
}