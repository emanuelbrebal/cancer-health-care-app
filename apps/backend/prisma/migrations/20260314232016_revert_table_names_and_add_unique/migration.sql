/*
  Warnings:

  - You are about to drop the `leisure_activities` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[title,type]` on the table `Media` will be added. If there are existing duplicate values, this will fail.

*/
-- DropTable
DROP TABLE "leisure_activities";

-- CreateTable
CREATE TABLE "LeisureActivity" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "type" "LeisureType" NOT NULL,
    "frequency" "FrequencyType" NOT NULL,
    "image_path" TEXT NOT NULL,
    "status" "StatusEnum" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeisureActivity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Media_title_type_key" ON "Media"("title", "type");
