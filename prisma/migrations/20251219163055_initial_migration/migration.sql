-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'ARTIST');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Artist" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,

    CONSTRAINT "Artist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Album" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "releaseYear" INTEGER NOT NULL,
    "coverUrl" TEXT NOT NULL,
    "genreId" TEXT,

    CONSTRAINT "Album_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Song" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "albumId" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,

    CONSTRAINT "Song_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Genre" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Genre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Playlist" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "visibility" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,

    CONSTRAINT "Playlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlaylistItem" (
    "playlistId" TEXT NOT NULL,
    "songId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "UserLikeSong" (
    "userId" TEXT NOT NULL,
    "songId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "UserLikeAlbum" (
    "userId" TEXT NOT NULL,
    "albumId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "UserLikePlaylist" (
    "userId" TEXT NOT NULL,
    "playlistId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PlaylistItem_playlistId_songId_key" ON "PlaylistItem"("playlistId", "songId");

-- CreateIndex
CREATE UNIQUE INDEX "UserLikeSong_userId_songId_key" ON "UserLikeSong"("userId", "songId");

-- CreateIndex
CREATE UNIQUE INDEX "UserLikeAlbum_userId_albumId_key" ON "UserLikeAlbum"("userId", "albumId");

-- CreateIndex
CREATE UNIQUE INDEX "UserLikePlaylist_userId_playlistId_key" ON "UserLikePlaylist"("userId", "playlistId");

-- AddForeignKey
ALTER TABLE "Album" ADD CONSTRAINT "Album_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Playlist" ADD CONSTRAINT "Playlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistItem" ADD CONSTRAINT "PlaylistItem_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistItem" ADD CONSTRAINT "PlaylistItem_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLikeSong" ADD CONSTRAINT "UserLikeSong_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLikeSong" ADD CONSTRAINT "UserLikeSong_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLikeAlbum" ADD CONSTRAINT "UserLikeAlbum_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLikeAlbum" ADD CONSTRAINT "UserLikeAlbum_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLikePlaylist" ADD CONSTRAINT "UserLikePlaylist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLikePlaylist" ADD CONSTRAINT "UserLikePlaylist_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
