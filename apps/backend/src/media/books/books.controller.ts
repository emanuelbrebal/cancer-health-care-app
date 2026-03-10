import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { BooksRepository } from './books.repository';
import { UpdateBookDto } from './dto/update-book.dto';
import { CreateBookDetailDto } from './dto/create-book.dto';
import { BookMapper } from '../mappers/book-mapper';

@Controller('books')
export class BooksController {
  constructor(
    private readonly booksRepository: BooksRepository
  ) { }

  @Post()
  async create(@Body() createBookDto: CreateBookDetailDto) {
    const book = await this.booksRepository.create(createBookDto);
    if (!book) {
      throw new InternalServerErrorException('Não foi possível criar o livro no momento.');
    }
    return {
      message: 'Livro criado com sucesso!',
      data: BookMapper.toDto(book)
    };
  }

  @Get()
  async findAll() {
    const books = await this.booksRepository.findAll();
    if (!books) throw new NotFoundException('Não há livros cadastrados no momento.');
    return books.map(book => BookMapper.toDto(book));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const book = await this.booksRepository.findOne(id);
    if (!book) throw new NotFoundException('Livro não encontrado');
    return BookMapper.toDto(book);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    if (!updateBookDto || Object.keys(updateBookDto).length === 0) {
      throw new BadRequestException('Nenhum dado válido fornecido para atualização');
    }
    return this.booksRepository.update(id, updateBookDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.booksRepository.delete(id);
    return { message: 'Livro removido com sucesso' };
  }
}
