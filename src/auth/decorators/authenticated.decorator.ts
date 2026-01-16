import { applyDecorators, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth } from "@nestjs/swagger";

export const Authenticated = () =>
  applyDecorators(UseGuards(AuthGuard("jwt")), ApiBearerAuth("access-token"));
