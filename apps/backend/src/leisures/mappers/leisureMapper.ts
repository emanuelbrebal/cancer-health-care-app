import type { LeisureActivity } from '@prisma/client';

export class LeisureMapper {
  static toDto(leisure: LeisureActivity | null) {
    if (!leisure) return null;

    return {
      id: leisure.id,
      name: leisure.name,
      type: leisure.type,
      frequency: leisure.frequency,
      imagePath: leisure.image_path || '',
      synopsis: leisure.synopsis ?? null,
      status: leisure.status,
    };
  }

  // Painel: campos públicos + datas (W03-1 pede a data de atualização).
  static toAdminDto(leisure: LeisureActivity) {
    return {
      ...this.toDto(leisure)!,
      createdAt: leisure.createdAt.toISOString(),
      updatedAt: leisure.updatedAt.toISOString(),
    };
  }

  static toDtoList(leisures: LeisureActivity[]) {
    if (!leisures) return [];
    return leisures.map((leisure) => this.toDto(leisure));
  }
}
