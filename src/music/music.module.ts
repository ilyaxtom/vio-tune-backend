import { Module } from "@nestjs/common";

import { ArtistModule } from "./artist/artist.module";

@Module({
  imports: [ArtistModule],
})
export class MusicModule {}
