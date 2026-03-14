import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { StatusEnum } from '@prisma/client';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';
import { BaseMediaRepository } from '../common/base-media.repository';

@Injectable()
export class SeriesRepository extends BaseMediaRepository{
  readonly type = 'SERIES';
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async create(data: CreateSeriesDto) {
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
        seriesDetails: {
          create: {
            showrunner: data.showrunner,
            externalLink: data.externalLink,
            episodes: data.episodes,
            seasons: data.seasons
          }
        }
      },
      include: { seriesDetails: true, genre: true }
    });
  }

  async findAll() {
    return this.prisma.media.findMany({
      where: {
        status: StatusEnum.ACTIVE,
        type: this.type
      },
      include: { seriesDetails: true, genre: true },
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
      include: { seriesDetails: true, genre: true },
    });
  }

  async update(id: string, data: UpdateSeriesDto) {
    const { showrunner, externalLink, seasons, episodes, genreId, ...mediaData } = data;

    return this.prisma.media.update({
      where: { id: id },
      data: {
        ...mediaData,
        ...(genreId && {
        genre: { connect: { id: genreId } }
      }),
        seriesDetails: {
          update: {
            showrunner,
            externalLink,
            seasons,
            episodes
          }
        }
      },
      include: { seriesDetails: true, genre: true }
    });
  }

}