import { Injectable } from '@nestjs/common';
import { CreateBookDetailDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { StatusEnum } from '@prisma/client';

@Injectable()
export class BooksRepository {
  readonly type = 'BOOK';
  constructor(private prisma: PrismaService) { }

  async create(data: CreateBookDetailDto) {
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
            page_count: data.pageCount
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
    const { author, eduCapesLink, pageCount, ...mediaData } = data;

    return this.prisma.media.update({
      where: { id: id },
      data: {
        ...mediaData,
        bookDetails: {
          update: {
            author,
            eduCapesLink,
            page_count: pageCount
          }
        }
      },
      include: { bookDetails: true, genre: true }
    });
  }

  async delete(id: string) {
    return this.prisma.media.update({
      where: { id: id },
      data: {
        status: StatusEnum.INACTIVE
      }
    });
  }
}