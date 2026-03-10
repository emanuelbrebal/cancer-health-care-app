import { PartialType } from '@nestjs/mapped-types';
import { CreateBookDetailDto } from './create-book.dto';

export class UpdateBookDto extends PartialType(CreateBookDetailDto) {}
