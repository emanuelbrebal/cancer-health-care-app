import { SeriesResponseDto } from "../books/dto/series-response-dto";
import { MediaMapper } from "./media-mapper";

export class SeriesMapper {
  static toDto(media: any): SeriesResponseDto {
    const details = media.seriesDetails || {};
    return {
      ...MediaMapper.mapCommonFields(media),
      showrunner: details.showrunner,
      seasons: details.seasons,
      episodes: details.episodes,
      externalLink: details.externalLink,
    };
  }
}