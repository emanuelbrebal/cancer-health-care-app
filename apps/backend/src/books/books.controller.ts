import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
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
  async create(@Body() createBookDto: CreateBookDetailDto) {
    const book = await this.booksRepository.create(createBookDto);
    if(!book)
    return 
  }

  @Get()
  async findAll() {
    return this.booksRepository.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.booksRepository.findOne(id);
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
