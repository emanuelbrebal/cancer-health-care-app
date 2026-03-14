import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { UpdateBookDto } from './dto/update-book.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { BookMapper } from '../mappers/book-mapper';
import { BooksService } from './books.service';

@Controller('books')
export class BooksController {
  constructor(
    private readonly bookService: BooksService
  ) { }

  @Post()
  async create(@Body() createBookDto: CreateBookDto) {
    const book = await this.bookService.create(createBookDto);
    return {
      message: 'Livro criado com sucesso!',
      data: BookMapper.toDto(book)
    };
  }

  @Get()
  async findAll() {
    const books = await this.bookService.findAll();
    return books.map(book => BookMapper.toDto(book));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const book = await this.bookService.findOne(id);
    return BookMapper.toDto(book);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    if (!updateBookDto || Object.keys(updateBookDto).length === 0) {
      throw new BadRequestException('Nenhum dado válido fornecido para atualização');
    }
    const updatedBook = await this.bookService.update(id, updateBookDto);
    return BookMapper.toDto(updatedBook);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.bookService.remove(id);
    return { message: 'Livro removido com sucesso' };
  }
}
