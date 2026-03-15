import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";

export class CreateTopicDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  content: string;

  @IsString()
  @IsOptional()
  image_path?: string;

  @IsUUID()
  @IsNotEmpty()
  authorId: string;

  @IsUUID()
  @IsOptional()
  communityId?: string;
}