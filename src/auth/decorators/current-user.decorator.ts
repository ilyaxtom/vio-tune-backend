import { createParamDecorator, ExecutionContext } from "@nestjs/common";

import { RequestWithUser } from "../interfaces";

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request: RequestWithUser = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
