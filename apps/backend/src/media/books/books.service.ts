import { Injectable, NotFoundException } from '@nestjs/common';
import { BooksRepository } from './books.repository';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(private readonly booksRepository: BooksRepository) {}

  async create(createBookDto: CreateBookDto) {
    return this.booksRepository.create(createBookDto);
  }

  async findAll() {
    const books = await this.booksRepository.findAll();
    if (!books || books.length === 0) {
      throw new NotFoundException('Nenhum livro cadastrado.');
    }
    return books;
  }

  async findOne(id: string) {
    const book = await this.booksRepository.findOne(id);
    if (!book) {
      throw new NotFoundException('Livro não encontrado.');
    }
    return book;
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    await this.findOne(id); 
    return this.booksRepository.update(id, updateBookDto);
  }

  async remove(id: string) {
    await this.findOne(id); 
    return this.booksRepository.delete(id);
  }
}