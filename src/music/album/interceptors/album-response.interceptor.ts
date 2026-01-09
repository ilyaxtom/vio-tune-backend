import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { map, Observable } from "rxjs";

import { MinioService } from "minio/services/minio.service";
import { AlbumResponseDto } from "music/album/dto";
import { AlbumWithArtistGenre } from "music/album/interfaces/album-with-artist.interface";

@Injectable()
export class AlbumResponseInterceptor implements NestInterceptor {
  constructor(private readonly minioService: MinioService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<AlbumWithArtistGenre>,
  ): Observable<AlbumResponseDto> {
    return next.handle().pipe(
      map((data) => {
        const transformed = {
          ...data,
          artwork: this.minioService.getPublicUrl(data.artwork),
          artist: data.artist.name,
          genre: data.genre?.name,
        };

        return plainToInstance(AlbumResponseDto, transformed, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
