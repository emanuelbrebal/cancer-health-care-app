import { PrismaService } from "src/prisma/prisma.service";
import { StatusEnum } from "@prisma/client";
import { Injectable } from "@nestjs/common";
@Injectable()
export class CascadeManager {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Soft deletes everything that's in a cascade by its model name and their foreign key.
   * @param parentModel prisma model
   * @param parentId parent's ID
   * @param children children element configuration { modelName: string, foreignKey: string }
   */
  async softDeleteCascade(
    parentModel: string,
    parentId: string,
    children: { modelName: string; foreignKey: string }[]
  ) {
    const operations = [
      (this.prisma[parentModel] as any).update({
        where: { id: parentId },
        data: { status: StatusEnum.DELETED },
      }),
    ];

    children.forEach((child) => {
      operations.push(
        (this.prisma[child.modelName] as any).updateMany({
          where: { [child.foreignKey]: parentId },
          data: { status: StatusEnum.DELETED },
        })
      );
    });

    return this.prisma.$transaction(operations);
  }
}