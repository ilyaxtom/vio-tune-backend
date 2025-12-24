import { Global, Module } from "@nestjs/common";

import { RequiredImagePipe } from "./pipes/required-image.pipe";
import { S3Provider } from "./providers/minio.provider";
import { MinioService } from "./services/minio.service";

@Global()
@Module({
  providers: [S3Provider, MinioService, RequiredImagePipe],
  exports: [MinioService, RequiredImagePipe],
})
export class MinioModule {}
