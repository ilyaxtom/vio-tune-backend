import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { User } from "@prisma/client";
import { plainToInstance } from "class-transformer";
import { map, Observable } from "rxjs";

import { UserResponseDto } from "user/dto";

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<User>,
  ): Observable<UserResponseDto> {
    return next.handle().pipe(
      map((data) => {
        return plainToInstance(UserResponseDto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
