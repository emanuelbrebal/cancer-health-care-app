/*
  Warnings:

  - You are about to drop the `LeisureActivity` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "LeisureType" AS ENUM ('PHYSICAL', 'CULTURAL', 'SOCIAL', 'THERAPY', 'RECREATIONAL', 'REST');

-- CreateEnum
CREATE TYPE "FrequencyType" AS ENUM ('DAILY', 'WEEKLY', 'FORTWEEKLY', 'MONTHLY', 'SPORADICAL');

-- DropTable
DROP TABLE "LeisureActivity";

-- CreateTable
CREATE TABLE "leisure_activities" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "type" "LeisureType" NOT NULL,
    "frequency" "FrequencyType" NOT NULL,
    "image_path" TEXT NOT NULL,
    "status" "StatusEnum" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leisure_activities_pkey" PRIMARY KEY ("id")
);
