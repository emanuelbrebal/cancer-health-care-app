/*
  Warnings:

  - You are about to drop the column `feeling` on the `DailyLog` table. All the data in the column will be lost.
  - You are about to alter the column `content` on the `DailyLog` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(2000)`.
  - A unique constraint covering the columns `[userId,date]` on the table `DailyLog` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `title` to the `DailyLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `DailyLog` table without a default value. This is not possible if the table is not empty.
  - Made the column `content` on table `DailyLog` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "DailyLog" DROP COLUMN "feeling",
ADD COLUMN     "date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "emotes" TEXT[],
ADD COLUMN     "title" VARCHAR(150) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "content" SET NOT NULL,
ALTER COLUMN "content" SET DATA TYPE VARCHAR(2000);

-- DropEnum
DROP TYPE "FeelingEnum";

-- CreateTable
CREATE TABLE "DailyLogAudit" (
    "id" TEXT NOT NULL,
    "logId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyLogAudit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DailyLog_userId_date_key" ON "DailyLog"("userId", "date");
