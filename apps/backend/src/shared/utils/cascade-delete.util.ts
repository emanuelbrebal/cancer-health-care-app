import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, StatusEnum } from '@prisma/client';
import { Injectable } from '@nestjs/common';

interface SoftDeletableDelegate {
  update(args: unknown): Prisma.PrismaPromise<unknown>;
  updateMany(args: unknown): Prisma.PrismaPromise<unknown>;
}

@Injectable()
export class CascadeManager {
  constructor(private readonly prisma: PrismaService) {}

  private delegate(modelName: string): SoftDeletableDelegate {
    const delegates = this.prisma as unknown as Record<
      string,
      SoftDeletableDelegate
    >;
    return delegates[modelName];
  }

  async softDeleteCascade(
    parentModel: string,
    parentId: string,
    children: { modelName: string; foreignKey: string }[],
  ) {
    const operations = [
      this.delegate(parentModel).update({
        where: { id: parentId },
        data: { status: StatusEnum.DELETED },
      }),
    ];

    children.forEach((child) => {
      operations.push(
        this.delegate(child.modelName).updateMany({
          where: { [child.foreignKey]: parentId },
          data: { status: StatusEnum.DELETED },
        }),
      );
    });

    return this.prisma.$transaction(operations);
  }
}
