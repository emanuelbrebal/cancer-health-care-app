import { ConflictException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export const DUPLICATE_CODE = 'DUPLICATE';

export function isUniqueViolation(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2002'
  );
}

// Violação de unicidade (P2002) vira 409 com a mensagem do recurso; qualquer outro erro segue.
// Não olha quais colunas colidiram, então continua valendo se a regra de unicidade mudar.
export function rethrowUnique(error: unknown, message: string): never {
  if (isUniqueViolation(error)) {
    throw new ConflictException({ message, code: DUPLICATE_CODE });
  }
  throw error;
}
