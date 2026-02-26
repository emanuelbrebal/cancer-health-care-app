import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BooksRepository } from './books.repository';
import { UpdateBookDto } from './dto/update-book.dto';
import { CreateBookDetailDto } from './dto/create-book.dto';

@Controller('books')
export class BooksController {
  constructor(
    // private readonly booksRepository: booksRepository,
    private readonly booksRepository: BooksRepository
  ) {}

  @Post()
  create(@Body() createBookDto: CreateBookDetailDto) {
    return this.booksRepository.create(createBookDto);
  }

  @Get()
  findAll() {
    return this.booksRepository.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.booksRepository.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksRepository.update(+id, updateBookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksRepository.remove(+id);
  }
}
