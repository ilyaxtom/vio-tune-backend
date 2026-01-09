import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { map, Observable } from "rxjs";

import { MinioService } from "minio/services/minio.service";
import { SongResponseDto } from "music/song/dto";
import { SongWithArtistAlbum } from "music/song/interfaces/song-with-artist-album.interface";

@Injectable()
export class SongResponseInterceptor implements NestInterceptor {
  constructor(private readonly minioService: MinioService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<SongWithArtistAlbum>,
  ): Observable<SongResponseDto> {
    return next.handle().pipe(
      map((data) => {
        const transformed = {
          ...data,
          album: data.album.title,
          artist: data.artist.name,
          fileUrl: this.minioService.getPublicUrl(data.fileUrl),
          artwork: this.minioService.getPublicUrl(data.album.artwork),
        };

        return plainToInstance(SongResponseDto, transformed, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
