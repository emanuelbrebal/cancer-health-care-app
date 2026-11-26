-- DropIndex
DROP INDEX "Genre_name_key";

-- DropIndex
DROP INDEX "Media_title_type_key";

-- CreateIndex
CREATE UNIQUE INDEX "Genre_name_type_key" ON "Genre"("name", "type");

-- CreateIndex
CREATE INDEX "Media_type_status_idx" ON "Media"("type", "status");

