-- DropForeignKey
ALTER TABLE "BookDetail" DROP CONSTRAINT "BookDetail_mediaId_fkey";

-- DropForeignKey
ALTER TABLE "MovieDetail" DROP CONSTRAINT "MovieDetail_mediaId_fkey";

-- DropForeignKey
ALTER TABLE "SeriesDetail" DROP CONSTRAINT "SeriesDetail_mediaId_fkey";

-- AddForeignKey
ALTER TABLE "SeriesDetail" ADD CONSTRAINT "SeriesDetail_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieDetail" ADD CONSTRAINT "MovieDetail_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookDetail" ADD CONSTRAINT "BookDetail_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;
