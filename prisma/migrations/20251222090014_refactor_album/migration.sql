/*
  Warnings:

  - You are about to drop the column `coverUrl` on the `Album` table. All the data in the column will be lost.
  - You are about to drop the column `releaseYear` on the `Album` table. All the data in the column will be lost.
  - Added the required column `artistId` to the `Album` table without a default value. This is not possible if the table is not empty.
  - Added the required column `artwork` to the `Album` table without a default value. This is not possible if the table is not empty.
  - Added the required column `copyright` to the `Album` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recordLabel` to the `Album` table without a default value. This is not possible if the table is not empty.
  - Added the required column `releaseDate` to the `Album` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Album` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Album` table without a default value. This is not possible if the table is not empty.
  - Added the required column `artwork` to the `Artist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Artist` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `visibility` on the `Playlist` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `duration` on the `Song` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AlbumType" AS ENUM ('ALBUM', 'SINGLE', 'COMPILATION', 'EP');

-- CreateEnum
CREATE TYPE "PlaylistVisibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- AlterTable
ALTER TABLE "Album" DROP COLUMN "coverUrl",
DROP COLUMN "releaseYear",
ADD COLUMN     "artistId" TEXT NOT NULL,
ADD COLUMN     "artwork" TEXT NOT NULL,
ADD COLUMN     "copyright" TEXT NOT NULL,
ADD COLUMN     "recordLabel" TEXT NOT NULL,
ADD COLUMN     "releaseDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "type" "AlbumType" NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Artist" ADD COLUMN     "artwork" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Playlist" DROP COLUMN "visibility",
ADD COLUMN     "visibility" "PlaylistVisibility" NOT NULL;

-- AlterTable
ALTER TABLE "PlaylistItem" ADD CONSTRAINT "PlaylistItem_pkey" PRIMARY KEY ("playlistId", "songId");

-- DropIndex
DROP INDEX "PlaylistItem_playlistId_songId_key";

-- AlterTable
ALTER TABLE "Song" DROP COLUMN "duration",
ADD COLUMN     "duration" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "UserLikeAlbum" ADD CONSTRAINT "UserLikeAlbum_pkey" PRIMARY KEY ("userId", "albumId");

-- DropIndex
DROP INDEX "UserLikeAlbum_userId_albumId_key";

-- AlterTable
ALTER TABLE "UserLikePlaylist" ADD CONSTRAINT "UserLikePlaylist_pkey" PRIMARY KEY ("userId", "playlistId");

-- DropIndex
DROP INDEX "UserLikePlaylist_userId_playlistId_key";

-- AlterTable
ALTER TABLE "UserLikeSong" ADD CONSTRAINT "UserLikeSong_pkey" PRIMARY KEY ("userId", "songId");

-- DropIndex
DROP INDEX "UserLikeSong_userId_songId_key";

-- CreateIndex
CREATE INDEX "Album_artistId_idx" ON "Album"("artistId");

-- AddForeignKey
ALTER TABLE "Album" ADD CONSTRAINT "Album_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
