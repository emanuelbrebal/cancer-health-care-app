export class MediaResponseDto {
  id: string;
  title: string;
  type: string;
  releaseYear: number | null;
  status: string;
  isFree: boolean;
  whereToFind: string[];
  imagePath: string;
  genre: string;
  synopsis: string | null;
}
