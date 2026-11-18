import { MovieResponseDto } from '../books/dto/movie-response.dto';
import { MediaMapper, MediaRecord } from './media-mapper';

export class MovieMapper {
  static toDto(media: MediaRecord): MovieResponseDto {
    const details = media.movieDetails;
    return {
      ...MediaMapper.mapCommonFields(media),
      director: details?.director,
      duration: details?.duration,
      externalLink: details?.externalLink,
    };
  }
}
