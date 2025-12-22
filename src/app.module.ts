import { Module } from "@nestjs/common";
import { PrismaModule } from './prisma/prisma.module';
import { MusicModule } from './music/music.module';

@Module({
  imports: [PrismaModule, MusicModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
