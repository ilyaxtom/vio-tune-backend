import { Module } from "@nestjs/common";

import { AlbumModule } from "./album/album.module";
import { ArtistModule } from "./artist/artist.module";
import { SongModule } from "./song/song.module";
import { GenreModule } from './genre/genre.module';

@Module({
  imports: [ArtistModule, AlbumModule, SongModule, GenreModule],
})
export class MusicModule {}
