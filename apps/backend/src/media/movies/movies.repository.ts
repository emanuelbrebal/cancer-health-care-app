import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { StatusEnum } from '@prisma/client';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { CreateMovieDto } from './dto/create-movie.dto';
import { BaseMediaRepository } from '../common/base-media.repository';

@Injectable()
export class MoviesRepository extends BaseMediaRepository {
  readonly type = 'MOVIE';
  constructor(prisma: PrismaService) {
    super(prisma);
  }
  async create(data: CreateMovieDto) {
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
        movieDetails: {
          create: {
            director: data.director,
            duration: data.duration,
            externalLink: data.externalLink
          }
        }
      },
      include: { movieDetails: true, genre: true }
    });
  }

  async findAll() {
    return this.prisma.media.findMany({
      where: {
        status: StatusEnum.ACTIVE,
        type: this.type
      },
      include: { movieDetails: true, genre: true },
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
      include: { movieDetails: true, genre: true },
    });
  }

  async update(id: string, data: UpdateMovieDto) {
    const { director, externalLink, duration, genreId, ...mediaData } = data;

    return this.prisma.media.update({
      where: { id: id },
      data: {
        ...mediaData,
        ...(genreId && {
        genre: { connect: { id: genreId } }
      }),
        movieDetails: {
          update: {
            director,
            externalLink,
            duration: duration
          }
        }
      },
      include: { movieDetails: true, genre: true }
    });
  }

}