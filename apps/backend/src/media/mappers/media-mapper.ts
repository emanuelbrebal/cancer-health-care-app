import { MediaResponseDto } from "../books/dto/media-response-dto";

export class MediaMapper {
  static mapCommonFields(media: any): MediaResponseDto {
    return {
      id: media.id,
      title: media.title,
      type: media.type,
      releaseYear: media.releaseYear,
      status: media.status,
      isFree: media.isFree,
      whereToFind: media.whereToFind,
      imagePath: media.imagePath,
      genre: media.genre?.name,
    };
  }
}