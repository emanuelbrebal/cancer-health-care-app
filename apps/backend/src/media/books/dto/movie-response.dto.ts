import { MediaResponseDto } from "./media-response-dto";

export class MovieResponseDto extends MediaResponseDto {
  director: string;
  duration: string;
  externalLink: string;
}