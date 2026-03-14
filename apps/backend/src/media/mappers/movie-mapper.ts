import { MovieResponseDto } from "../books/dto/movie-response.dto";
import { MediaMapper } from "./media-mapper";

export class MovieMapper {
   static toDto(media: any): MovieResponseDto {
    const details = media.movieDetails || {};
    return {
      ...MediaMapper.mapCommonFields(media),
      director: details.director,
      duration: details.duration,
      externalLink: details.externalLink,
    };
  }
}