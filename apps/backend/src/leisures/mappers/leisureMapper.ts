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

  static toDtoList(leisures: LeisureActivity[]) {
    if (!leisures) return [];
    return leisures.map((leisure) => this.toDto(leisure));
  }
}
