import { PartialType } from '@nestjs/mapped-types';
import { CreateLeisureDto } from './create-leisure.dto';

export class UpdateLeisureDto extends PartialType(CreateLeisureDto) {}
