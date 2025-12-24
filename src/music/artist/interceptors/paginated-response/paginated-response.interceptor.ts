import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Artist } from "@prisma/client";
import { plainToInstance } from "class-transformer";
import { map, Observable } from "rxjs";

import { MinioService } from "minio/services/minio.service";
import { ArtistResponseDto } from "music/artist/dto";
import { PageDto } from "shared/dto";

@Injectable()
export class PaginatedResponseInterceptor implements NestInterceptor {
  constructor(private readonly minioService: MinioService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<PageDto<Artist>>,
  ): Observable<PageDto<ArtistResponseDto>> {
    return next.handle().pipe(
      map((data) => {
        const transformedData = data.data.map((artist) =>
          plainToInstance(
            ArtistResponseDto,
            {
              ...artist,
              artwork: this.minioService.getPublicUrl(artist.artwork),
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
