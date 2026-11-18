import { MediaResponseDto } from '../../common/dto/media-response-dto';

export class MovieResponseDto extends MediaResponseDto {
  director?: string | null;
  duration?: string | null;
  externalLink?: string | null;
}
