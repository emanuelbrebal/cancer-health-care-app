import {
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { Paginated } from 'common/pagination/pagination';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AdminLeisureQueryDto } from './dto/admin-leisure-query.dto';
import { LeisuresService } from './leisures.service';
import { LeisureMapper } from './mappers/leisureMapper';

type AdminLeisure = ReturnType<typeof LeisureMapper.toAdminDto>;

// Rotas do painel (PRD 03, W03-2/W03-3): incluem inativos. As públicas seguem só com ativos.
@Controller('admin/leisures')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminLeisuresController {
  constructor(private readonly leisuresService: LeisuresService) {}

  @Get()
  async list(
    @Query() query: AdminLeisureQueryDto,
  ): Promise<Paginated<AdminLeisure>> {
    const { items, total } = await this.leisuresService.findAdmin(query);
    return {
      items: items.map((l) => LeisureMapper.toAdminDto(l)),
      total,
      page: query.page,
      limit: query.limit,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return LeisureMapper.toAdminDto(
      await this.leisuresService.findAnyStatus(id),
    );
  }

  @Patch(':id/reactivate')
  async reactivate(@Param('id') id: string) {
    return LeisureMapper.toAdminDto(await this.leisuresService.reactivate(id));
  }
}
