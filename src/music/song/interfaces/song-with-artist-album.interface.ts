import { Prisma } from "@prisma/client";

export type SongWithArtistAlbum = Prisma.SongGetPayload<{
  include: { artist: true; album: true };
}>;
