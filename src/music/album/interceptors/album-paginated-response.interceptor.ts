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
import { PageDto } from "shared/dto";

@Injectable()
export class AlbumPaginatedResponseInterceptor implements NestInterceptor {
  constructor(private readonly minioService: MinioService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<PageDto<Album>>,
  ): Observable<PageDto<AlbumResponseDto>> {
    return next.handle().pipe(
      map((data) => {
        const transformedData = data.data.map((album) =>
          plainToInstance(
            AlbumResponseDto,
            {
              ...album,
              artwork: this.minioService.getPublicUrl(album.artwork),
            },
            {
              excludeExtraneousValues: true,
            },
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
