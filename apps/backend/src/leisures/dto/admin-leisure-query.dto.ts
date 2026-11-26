import { FrequencyType, LeisureType } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';
import { AdminListQueryDto } from 'common/pagination/pagination';

export class AdminLeisureQueryDto extends AdminListQueryDto {
  @IsOptional()
  @IsEnum(LeisureType, { message: 'Tipo de atividade inválido' })
  type?: LeisureType;

  @IsOptional()
  @IsEnum(FrequencyType, { message: 'Frequência inválida' })
  frequency?: FrequencyType;
}
