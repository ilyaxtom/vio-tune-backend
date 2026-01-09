import { Global, Module } from "@nestjs/common";

import { RequiredFilePipe } from "../shared/pipes/required-file.pipe";
import { S3Provider } from "./providers/minio.provider";
import { MinioService } from "./services/minio.service";

@Global()
@Module({
  providers: [S3Provider, MinioService, RequiredFilePipe],
  exports: [MinioService, RequiredFilePipe],
})
export class MinioModule {}
