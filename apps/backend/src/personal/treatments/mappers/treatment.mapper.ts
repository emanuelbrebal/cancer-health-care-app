import { Treatment } from '@prisma/client';

export class TreatmentMapper {
  static toDto(treatment: Treatment) {
    return {
      id: treatment.id,
      name: treatment.name,
      frequency: treatment.frequency,
      startTime: treatment.startTime,
      endDate: treatment.endDate,
      doctorName: treatment.doctorName,
      doctorContact: treatment.doctorContact,
      hospitalName: treatment.hospitalName,
      status: treatment.status,
      createdAt: treatment.createdAt,
      updatedAt: treatment.updatedAt,
    };
  }

  static toDtoList(treatments: Treatment[]) {
    return treatments.map(TreatmentMapper.toDto);
  }
}
