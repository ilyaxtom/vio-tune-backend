import { Like } from "../interfaces/like.interface";

export const LIKE_CONFIG = {
  [Like.SONG]: {
    model: "song",
    joinModel: "userLikeSong",
    resourceKey: "songId",
  },
  [Like.ALBUM]: {
    model: "album",
    joinModel: "userLikeAlbum",
    resourceKey: "albumId",
  },
  [Like.PLAYLIST]: {
    model: "playlist",
    joinModel: "userLikePlaylist",
    resourceKey: "playlistId",
  },
};
