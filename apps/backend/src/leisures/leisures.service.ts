import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateLeisureDto } from './dto/create-leisure.dto';
import { UpdateLeisureDto } from './dto/update-leisure.dto';
import { BooksRepository } from 'src/books/books.repository';
import { ILeisureStrategy } from './strategy/leisure-strategy.interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LeisuresService {
  private readonly strategies: ILeisureStrategy[];

  constructor(
    private readonly booksRepository: BooksRepository,
    private readonly prisma: PrismaService
  ){};

  create(createLeisureDto: CreateLeisureDto) {
    const strategy = this.strategies.find(s => s.type === createLeisureDto.type);

    if (!strategy) {
      throw new BadRequestException('Tipo de mídia não oficial.');
    }

    return strategy.create(createLeisureDto);
  }

  findAll() {
    return this.prisma.media.findMany({
      where: {
        status: 'ACTIVE',
      },
      include:{
        bookDetails: true,
        movieDetails: true,
        seriesDetails: true,
        genre: true
      }
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} leisure`;
  }

  update(id: number, updateLeisureDto: UpdateLeisureDto) {
    return `This action updates a #${id} leisure`;
  }

  remove(id: number) {
    return `This action removes a #${id} leisure`;
  }
}
