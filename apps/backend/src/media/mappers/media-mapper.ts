import { MediaResponseDto } from "../common/dto/media-response-dto";

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
      imagePath: media.image_path || '', 
      genre: media.genre?.name || 'Sem gênero',
    };
  }
}