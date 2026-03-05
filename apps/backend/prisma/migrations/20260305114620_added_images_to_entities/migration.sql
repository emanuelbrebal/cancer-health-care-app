/*
  Warnings:

  - You are about to alter the column `content` on the `Comment` table. The data in that column could be lost. The data in that column will be cast from `VarChar(1000)` to `VarChar(300)`.
  - Added the required column `image_path` to the `Media` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BookDetail" ADD COLUMN     "page_count" INTEGER;

-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "content" SET DATA TYPE VARCHAR(300);

-- AlterTable
ALTER TABLE "Community" ADD COLUMN     "image_path" TEXT;

-- AlterTable
ALTER TABLE "LeisureActivity" ADD COLUMN     "image_path" TEXT;

-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "image_path" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MovieDetail" ADD COLUMN     "duration" VARCHAR(120);

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "image_path" TEXT;

-- AlterTable
ALTER TABLE "SeriesDetail" ADD COLUMN     "episodes" INTEGER;

-- AlterTable
ALTER TABLE "Topic" ADD COLUMN     "image_path" TEXT;
