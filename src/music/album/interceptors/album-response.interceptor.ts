import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Album } from "@prisma/client";
import { plainToInstance } from "class-transformer";
import { map, Observable } from "rxjs";

import { MinioService } from "minio/services/minio.service";
import { AlbumResponseDto } from "music/album/dto";

@Injectable()
export class AlbumResponseInterceptor implements NestInterceptor {
  constructor(private readonly minioService: MinioService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<Album>,
  ): Observable<AlbumResponseDto> {
    return next.handle().pipe(
      map((data) => {
        const transformed = {
          ...data,
          artwork: this.minioService.getPublicUrl(data.artwork),
        };

        return plainToInstance(AlbumResponseDto, transformed, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
