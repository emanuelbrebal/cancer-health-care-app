-- AlterTable: add synopsis field to Media (books, movies, series)
ALTER TABLE "Media" ADD COLUMN "synopsis" TEXT;

-- AlterTable: add synopsis field to LeisureActivity (home activities)
ALTER TABLE "LeisureActivity" ADD COLUMN "synopsis" TEXT;
