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
import { PageDto } from "shared/dto";

import { SongWithArtistAlbum } from "../interfaces/song-with-artist-album.interface";

@Injectable()
export class SongPaginatedResponseInterceptor implements NestInterceptor {
  constructor(private readonly minioService: MinioService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<PageDto<SongWithArtistAlbum>>,
  ): Observable<PageDto<SongResponseDto>> {
    return next.handle().pipe(
      map((data) => {
        const transformedData = data.data.map((song) =>
          plainToInstance(
            SongResponseDto,
            {
              ...song,
              artist: song.artist.name,
              album: song.album.title,
              artwork: this.minioService.getPublicUrl(song.album.artwork),
            },
            { excludeExtraneousValues: true },
          ),
        );

        return {
          data: transformedData,
          meta: data.meta,
        };
      }),
    );
  }
}
