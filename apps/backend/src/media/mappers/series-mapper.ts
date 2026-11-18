import { SeriesResponseDto } from '../books/dto/series-response-dto';
import { MediaMapper, MediaRecord } from './media-mapper';

export class SeriesMapper {
  static toDto(media: MediaRecord): SeriesResponseDto {
    const details = media.seriesDetails;
    return {
      ...MediaMapper.mapCommonFields(media),
      showrunner: details?.showrunner,
      seasons: details?.seasons,
      episodes: details?.episodes,
      externalLink: details?.externalLink,
    };
  }
}
