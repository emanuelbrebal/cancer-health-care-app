import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
  MaxLength,
  IsIn,
  ArrayMaxSize,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class HistoryMessageDto {
  @IsString()
  @IsIn(['user', 'assistant'])
  role: 'user' | 'assistant';

  @IsString()
  @MaxLength(1000)
  content: string;
}

export class AskAiDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  userQuestion: string;

  @IsArray()
  @IsOptional()
  @ArrayMaxSize(20)
  calendarData: any[];

  @IsArray()
  @IsOptional()
  @ArrayMaxSize(20)
  treatmentData: any[];

  @IsArray()
  @IsOptional()
  @ArrayMaxSize(8)
  @ValidateNested({ each: true })
  @Type(() => HistoryMessageDto)
  history?: HistoryMessageDto[];
}
