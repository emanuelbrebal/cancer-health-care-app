import { BookResponseDto } from '../books/dto/book-response-dto';
import { MediaMapper, MediaRecord } from './media-mapper';

export class BookMapper {
  static toDto(media: MediaRecord): BookResponseDto {
    const details = media.bookDetails;
    return {
      ...MediaMapper.mapCommonFields(media),
      author: details?.author,
      eduCapesLink: details?.eduCapesLink,
      visitCount: details?.visitCount,
      pageCount: details?.page_count || 0,
    };
  }
}
