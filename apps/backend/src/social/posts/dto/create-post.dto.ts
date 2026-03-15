import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsOptional()
  image_path?: string;

  @IsUUID()
  @IsNotEmpty()
  authorId: string;

  @IsUUID()
  @IsNotEmpty()
  topicId: string;
}