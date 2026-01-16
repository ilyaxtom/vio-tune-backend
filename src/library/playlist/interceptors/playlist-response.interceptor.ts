import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { map, Observable } from "rxjs";

import { PlaylistResponseDto } from "library/playlist/dto/playlist-response.dto";
import { PlaylistWithItems } from "library/playlist/interfaces/playlist-with-items.interface";
import { MinioService } from "minio/services/minio.service";

@Injectable()
export class PlaylistResponseInterceptor implements NestInterceptor {
  constructor(private readonly minioService: MinioService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<PlaylistWithItems>,
  ): Observable<PlaylistResponseDto> {
    return next.handle().pipe(
      map((data) => {
        const transformed = {
          ...data,
          songs: data.playlistItem.map((item) => ({
            ...item.song,
            fileUrl: this.minioService.getPublicUrl(item.song.fileUrl),
          })),
        };

        return plainToInstance(PlaylistResponseDto, transformed, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });
      }),
    );
  }
}
