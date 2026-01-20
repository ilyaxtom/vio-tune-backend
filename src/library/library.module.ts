import { Module } from '@nestjs/common';
import { PlaylistModule } from './playlist/playlist.module';
import { InteractionsModule } from './interactions/interactions.module';

@Module({
  imports: [PlaylistModule, InteractionsModule]
})
export class LibraryModule {}
