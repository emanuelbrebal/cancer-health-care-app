import { MediaResponseDto } from '../../common/dto/media-response-dto';

export class SeriesResponseDto extends MediaResponseDto {
  showrunner?: string | null;
  externalLink?: string | null;
  seasons?: number | null;
  episodes?: number | null;
}
