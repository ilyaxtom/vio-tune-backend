import { Prisma } from "@prisma/client";

export type AlbumWithArtistGenre = Prisma.AlbumGetPayload<{
  include: { artist: true; genre: true };
}>;
