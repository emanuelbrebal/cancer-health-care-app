import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import {
  AdminGenreQueryDto,
  CreateGenreDto,
  GenreQueryDto,
  UpdateGenreDto,
} from './dto/genre.dto';
import { GenresService } from './genres.service';

@Controller('genres')
export class GenresController {
  constructor(private readonly genres: GenresService) {}

  @Get()
  findAll(@Query() query: GenreQueryDto) {
    return this.genres.findPublic(query);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() dto: CreateGenreDto) {
    return this.genres.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  rename(@Param('id') id: string, @Body() dto: UpdateGenreDto) {
    return this.genres.rename(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async inactivate(@Param('id') id: string) {
    await this.genres.inactivate(id);
    return { message: 'Gênero inativado com sucesso.' };
  }
}

@Controller('admin/genres')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminGenresController {
  constructor(private readonly genres: GenresService) {}

  @Get()
  findAll(@Query() query: AdminGenreQueryDto) {
    return this.genres.findAdmin(query);
  }

  @Patch(':id/reactivate')
  reactivate(@Param('id') id: string) {
    return this.genres.reactivate(id);
  }
}
