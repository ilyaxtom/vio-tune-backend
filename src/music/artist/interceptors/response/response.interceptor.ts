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

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private readonly minioService: MinioService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<Artist>,
  ): Observable<ArtistResponseDto> {
    return next.handle().pipe(
      map((data) => {
        const transformed = {
          ...data,
          artwork: this.minioService.getPublicUrl(data.artwork),
        };

        return plainToInstance(ArtistResponseDto, transformed, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
