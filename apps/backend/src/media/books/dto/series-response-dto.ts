import { MediaResponseDto } from "./media-response-dto";

export class SeriesResponseDto extends MediaResponseDto {
  showrunner: string;
  externalLink: string;
  seasons: number;
  episodes: number;
}