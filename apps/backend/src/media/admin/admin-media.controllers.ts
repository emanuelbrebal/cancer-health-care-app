import {
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MediaType, UserRole } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AdminMediaService } from './admin-media.service';
import { AdminMediaQueryDto } from './dto/admin-media-query.dto';

// Rotas do painel por tipo (PRD 02, G5/G6). Uma classe base, três prefixos: rota com `:kind`
// colidiria com /admin/genres e /admin/leisures.
abstract class AdminMediaController {
  protected constructor(
    private readonly service: AdminMediaService,
    private readonly type: MediaType,
  ) {}

  @Get()
  list(@Query() query: AdminMediaQueryDto) {
    return this.service.list(this.type, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(this.type, id);
  }

  @Patch(':id/reactivate')
  reactivate(@Param('id') id: string) {
    return this.service.reactivate(this.type, id);
  }
}

@Controller('admin/books')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminBooksController extends AdminMediaController {
  constructor(service: AdminMediaService) {
    super(service, MediaType.BOOK);
  }
}

@Controller('admin/movies')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminMoviesController extends AdminMediaController {
  constructor(service: AdminMediaService) {
    super(service, MediaType.MOVIE);
  }
}

@Controller('admin/series')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminSeriesController extends AdminMediaController {
  constructor(service: AdminMediaService) {
    super(service, MediaType.SERIES);
  }
}
