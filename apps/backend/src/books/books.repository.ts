import { Injectable } from '@nestjs/common';
import { CreateBookDetailDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UUID } from 'crypto';
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
        type: 'BOOK',
        genreId: data.genreId,
        isFree: data.isFree,
        bookDetails: {
          create: {
            author: data.author,
            eduCapesLink: data.eduCapesLink,
            visitCount: 0
          }
        }
      },
      include: { bookDetails: true }
    });
  }

  async findAll() {
    return this.prisma.media.findMany(
      {
        where: {
          status: StatusEnum.ACTIVE
        },
        include: {
          bookDetails: true,
          genre: true
        },
        orderBy: {
          createdAt: 'asc'
        }
      }
    );
  }

  async findOne(id: string) {
    return this.prisma.media.findFirst({
      where:
      {
        id: id,
        status: StatusEnum.ACTIVE,
      },
      include: {
        bookDetails: true,
        genre: true
      },
    });
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    return this.prisma.media.update({ 
      where: { id: id },
      data: updateBookDto
    });
  }

  async delete(id: string) {
    return this.prisma.media.delete({ 
      where: { id: id },
      });
  }
}
