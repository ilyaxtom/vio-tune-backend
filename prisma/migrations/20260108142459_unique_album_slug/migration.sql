/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `albums` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "albums_slug_key" ON "albums"("slug");
