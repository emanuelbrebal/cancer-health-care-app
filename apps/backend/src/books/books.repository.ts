import { Injectable } from '@nestjs/common';
import { CreateBookDetailDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PrismaService } from 'src/prisma/prisma.service';

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
      bookDetails: {
        create: {
          author: data.author,
          isOpenSource: data.isOpenSource,
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
          type: "BOOK",
          status: "ACTIVE"
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

  async findOne(id: number) {
    return `This action returns a #${id} book`;
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    return `This action updates a #${id} book`;
  }

  async remove(id: number) {
    return `This action removes a #${id} book`;
  }
}
