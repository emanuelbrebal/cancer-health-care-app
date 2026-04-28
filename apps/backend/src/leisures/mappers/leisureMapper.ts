import { LeisureType, FrequencyType, StatusEnum } from '@prisma/client';

export class LeisureMapper {
  static toDto(leisure: any) {
    if (!leisure) return null;

    return {
      id: leisure.id,
      name: leisure.name,
      type: leisure.type as LeisureType,
      frequency: leisure.frequency as FrequencyType,
      imagePath: leisure.image_path || '',
      synopsis: leisure.synopsis ?? null,
      status: leisure.status as StatusEnum,
    };
  }

  static toDtoList(leisures: any[]) {
    if (!leisures) return [];
    return leisures.map((leisure) => this.toDto(leisure));
  }
}