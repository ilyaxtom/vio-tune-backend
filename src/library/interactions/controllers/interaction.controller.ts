import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import type { User } from "@prisma/client";

import { Authenticated } from "auth/decorators";
import { CurrentUser } from "auth/decorators/current-user.decorator";
import { LikeDto } from "library/interactions/dto/like.dto";

import { LikesService } from "../services/likes.service";

@ApiTags("Interactions")
@Controller()
export class InteractionController {
  constructor(private readonly likesService: LikesService) {}

  @Post("like")
  @HttpCode(HttpStatus.OK)
  @Authenticated()
  like(@Body() dto: LikeDto, @CurrentUser() user: User) {
    return this.likesService.handleLike(dto, user);
  }
}
