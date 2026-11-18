import type {
  BookDetail,
  Genre,
  Media,
  MovieDetail,
  SeriesDetail,
} from '@prisma/client';
import { MediaResponseDto } from '../common/dto/media-response-dto';

export type MediaRecord = Media & {
  genre?: Genre | null;
  bookDetails?: BookDetail | null;
  movieDetails?: MovieDetail | null;
  seriesDetails?: SeriesDetail | null;
};

export class MediaMapper {
  static mapCommonFields(media: MediaRecord): MediaResponseDto {
    return {
      id: media.id,
      title: media.title,
      type: media.type,
      releaseYear: media.releaseYear,
      status: media.status,
      isFree: media.isFree,
      whereToFind: media.whereToFind,
      imagePath: media.image_path || '',
      genre: media.genre?.name || 'Sem gênero',
      synopsis: media.synopsis ?? null,
    };
  }
}
