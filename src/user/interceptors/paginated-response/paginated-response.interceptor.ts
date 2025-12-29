import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { User } from "@prisma/client";
import { plainToInstance } from "class-transformer";
import { map, Observable } from "rxjs";

import { PageDto } from "shared/dto";
import { UserResponseDto } from "user/dto";

@Injectable()
export class PaginatedResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<PageDto<User>>,
  ): Observable<PageDto<UserResponseDto>> {
    return next.handle().pipe(
      map((data) => {
        const transformedData = data.data.map((user) =>
          plainToInstance(UserResponseDto, user, {
            excludeExtraneousValues: true,
          }),
        );

        return {
          data: transformedData,
          meta: data.meta,
        };
      }),
    );
  }
}
