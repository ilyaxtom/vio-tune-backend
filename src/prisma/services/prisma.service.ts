import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor(configService: ConfigService) {
    const databaseUrl = configService.get("database").url;

    const adapter = new PrismaPg({
      connectionString: databaseUrl,
    });

    super({ adapter });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log("Connected to database");
    } catch (error) {
      this.logger.error("Failed to connect to database", error);
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      this.logger.log("Disconnected from database");
    } catch (error) {
      this.logger.error("Failed to disconnect from database", error);
    }
  }
}
