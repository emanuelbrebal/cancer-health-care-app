import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { StatusEnum } from '@prisma/client';
import { BaseMediaRepository } from '../common/base-media.repository';

@Injectable()
export class BooksRepository extends BaseMediaRepository {
  readonly type = 'BOOK';
  constructor(prisma: PrismaService) {
    super(prisma);
  }
  async create(data: CreateBookDto) {
    return this.prisma.media.create({
      data: {
        title: data.title,
        releaseYear: data.releaseYear,
        type: this.type,
        genreId: data.genreId,
        isFree: data.isFree,
        status: StatusEnum.ACTIVE,
        image_path: data.image_path || '',
        whereToFind: data.whereToFind,
        bookDetails: {
          create: {
            author: data.author,
            eduCapesLink: data.eduCapesLink,
            visitCount: 0,
            page_count: data.page_count
          }
        }
      },
      include: { bookDetails: true, genre: true }
    });
  }

  async findAll() {
    return this.prisma.media.findMany({
      where: {
        status: StatusEnum.ACTIVE,
        type: this.type
      },
      include: { bookDetails: true, genre: true },
      orderBy: { createdAt: 'asc' }
    });
  }

  async findOne(id: string) {
    return this.prisma.media.findFirst({
      where: {
        id: id,
        status: StatusEnum.ACTIVE,
        type: this.type
      },
      include: { bookDetails: true, genre: true },
    });
  }

  async update(id: string, data: UpdateBookDto) {
    const { author, eduCapesLink, page_count, genreId, ...mediaData } = data;

    return this.prisma.media.update({
      where: { id },

      data: {
        ...mediaData,
        ...(genreId && {
          genre: { connect: { id: genreId } }
        }),
        bookDetails: {
          update: {
            author,
            eduCapesLink,
            page_count
          }
        }
      },
      include: { bookDetails: true, genre: true }
    });
  }

}