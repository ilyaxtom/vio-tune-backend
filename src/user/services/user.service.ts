import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { PrismaService } from "prisma/services/prisma.service";
import { PageDto, PageMetaDto, PageOptionsDto } from "shared/dto";
import { CreateUserDto, OAuthUserDto, UpdateUserDto } from "user/dto";

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(pageOptions: PageOptionsDto) {
    const { page, limit, search, order } = pageOptions;

    const where = search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              firstName: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              lastName: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          ],
        }
      : undefined;

    const [items, count] = await this.prismaService.$transaction([
      this.prismaService.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          username: order,
        },
      }),
      this.prismaService.user.count({ where }),
    ]);

    const pageMeta = new PageMetaDto(pageOptions, count);

    return new PageDto(items, pageMeta);
  }

  async findById(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: id },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async findByUsername(username: string) {
    const user = await this.prismaService.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }

    return user;
  }

  async findByVerificationToken(verificationToken: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        verificationToken,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with verification token not found`);
    }

    return user;
  }

  async create(createUserDto: CreateUserDto) {
    return await this.prismaService.user.create({
      data: { ...createUserDto },
    });
  }

  async update(username: string, updateUserDto: UpdateUserDto) {
    return await this.prismaService.user.update({
      where: { username },
      data: updateUserDto,
    });
  }

  async delete(username: string) {
    return await this.prismaService.user.delete({
      where: { username },
    });
  }

  async verifyEmail(id: string) {
    return await this.prismaService.user.update({
      where: { id },
      data: {
        isVerified: true,
        verificationToken: null,
      },
    });
  }

  async findOrCreateOAuthUser(data: OAuthUserDto) {
    return this.prismaService.$transaction(async (tx) => {
      const oauthAccount = await tx.oAuthAccount.findUnique({
        where: {
          provider_providerId: {
            provider: data.provider,
            providerId: data.providerId,
          },
        },
        include: { user: true },
      });

      if (oauthAccount) {
        return oauthAccount.user;
      }

      let user = await tx.user.findUnique({ where: { email: data.email } });

      if (!user) {
        user = await tx.user.create({
          data: {
            email: data.email,
            isVerified: true,
          },
        });
      }

      await tx.oAuthAccount.create({
        data: {
          provider: data.provider,
          providerId: data.providerId,
          email: data.email,
          userId: user.id,
        },
      });

      return user;
    });
  }
}
