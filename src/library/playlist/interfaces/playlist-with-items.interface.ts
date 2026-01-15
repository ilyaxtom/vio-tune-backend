import { Prisma } from "@prisma/client";

export type PlaylistWithItems = Prisma.PlaylistGetPayload<{
  include: {
    playlistItem: {
      include: {
        song: true;
      };
    };
  };
}>;
