import { Injectable, NotFoundException } from '@nestjs/common';
import { MediaType } from '@prisma/client';
import { MediaRulesService } from '../common/media-rules.service';
import { BooksRepository } from './books.repository';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

const NOT_FOUND = 'Livro não encontrado.';

@Injectable()
export class BooksService {
  constructor(
    private readonly booksRepository: BooksRepository,
    private readonly rules: MediaRulesService,
  ) {}

  async create(dto: CreateBookDto) {
    await this.rules.assertGenre(dto.genreId, MediaType.BOOK);
    await this.rules.assertUnique({
      type: MediaType.BOOK,
      title: dto.title,
      author: dto.author,
    });
    return this.booksRepository.create(dto);
  }

  async findAll() {
    return this.booksRepository.findAll();
  }

  async findOne(id: string) {
    const book = await this.booksRepository.findOne(id);
    if (!book) throw new NotFoundException(NOT_FOUND);
    return book;
  }

  // Vale também para item inativo: o painel edita antes de reativar.
  async update(id: string, dto: UpdateBookDto) {
    const current = await this.booksRepository.findAnyStatus(id);
    if (!current) throw new NotFoundException(NOT_FOUND);
    if (dto.genreId) await this.rules.assertGenre(dto.genreId, MediaType.BOOK);
    if (dto.title !== undefined || dto.author !== undefined) {
      await this.rules.assertUnique(
        {
          type: MediaType.BOOK,
          title: dto.title ?? current.title,
          author: dto.author ?? current.bookDetails?.author,
        },
        id,
      );
    }
    return this.booksRepository.update(id, dto);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.booksRepository.delete(id);
  }
}
