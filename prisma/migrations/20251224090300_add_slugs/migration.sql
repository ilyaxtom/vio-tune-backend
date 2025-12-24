/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `artists` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `playlists` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `playlists` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "albums" ADD COLUMN     "slug" TEXT;

-- AlterTable
ALTER TABLE "artists" ADD COLUMN     "slug" TEXT;

-- AlterTable
ALTER TABLE "playlists" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "artists_slug_key" ON "artists"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "playlists_slug_key" ON "playlists"("slug");
