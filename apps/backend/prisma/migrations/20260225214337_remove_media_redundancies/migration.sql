/*
  Warnings:

  - You are about to drop the column `isOpenSource` on the `BookDetail` table. All the data in the column will be lost.
  - You are about to drop the column `active` on the `Genre` table. All the data in the column will be lost.
  - You are about to drop the column `active` on the `LeisureActivity` table. All the data in the column will be lost.
  - You are about to drop the column `active` on the `Media` table. All the data in the column will be lost.
  - You are about to drop the column `isFree` on the `MovieDetail` table. All the data in the column will be lost.
  - You are about to drop the column `whereToWatch` on the `MovieDetail` table. All the data in the column will be lost.
  - You are about to drop the column `isFree` on the `SeriesDetail` table. All the data in the column will be lost.
  - You are about to drop the column `whereToWatch` on the `SeriesDetail` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BookDetail" DROP COLUMN "isOpenSource";

-- AlterTable
ALTER TABLE "Genre" DROP COLUMN "active",
ADD COLUMN     "status" "StatusEnum" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "LeisureActivity" DROP COLUMN "active",
ADD COLUMN     "status" "StatusEnum" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "Media" DROP COLUMN "active",
ADD COLUMN     "isFree" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "status" "StatusEnum" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "whereToFind" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "MovieDetail" DROP COLUMN "isFree",
DROP COLUMN "whereToWatch";

-- AlterTable
ALTER TABLE "SeriesDetail" DROP COLUMN "isFree",
DROP COLUMN "whereToWatch";
