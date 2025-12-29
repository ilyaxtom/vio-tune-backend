import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";

import { PageDto, PageOptionsDto } from "shared/dto";
import { CreateUserDto, UpdateUserDto, UserResponseDto } from "user/dto";
import { UserService } from "user/services/user.service";

import {
  PaginatedResponseInterceptor,
  ResponseInterceptor,
} from "../interceptors";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseInterceptors(PaginatedResponseInterceptor)
  @ApiResponse({
    status: 200,
    description: "Users list retrieved successfully",
    type: PageDto<UserResponseDto>,
  })
  getUsers(@Query() pageOptions: PageOptionsDto) {
    return this.userService.findAll(pageOptions);
  }

  @Get(":username")
  @UseInterceptors(ResponseInterceptor)
  @ApiResponse({
    status: 200,
    description: "User profile retrieved successfully",
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: "User not found" })
  getUserByUsername(@Param("username") username: string) {
    return this.userService.findByUsername(username);
  }

  @Post()
  @UseInterceptors(ResponseInterceptor)
  @ApiResponse({ status: 201, description: "User registered successfully" })
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto, "aslkfjaslkf");
  }

  @Patch(":username")
  @UseInterceptors(ResponseInterceptor)
  @ApiResponse({ status: 200, description: "User updated successfully" })
  updateUser(
    @Param("username") username: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(username, updateUserDto);
  }

  @Delete(":username")
  @UseInterceptors(ResponseInterceptor)
  @ApiResponse({ status: 200, description: "User deleted successfully" })
  deleteUser(@Param("username") username: string) {
    return this.userService.delete(username);
  }
}
