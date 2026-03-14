import { MediaResponseDto } from "../../common/dto/media-response-dto";

export class BookResponseDto extends MediaResponseDto {
  author: string;
  eduCapesLink: string;
  visitCount: number;
  pageCount: number;
}