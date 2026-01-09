import { Injectable } from "@nestjs/common";

import { MinioService } from "minio/services/minio.service";
import { slugify } from "shared/utils/slugify";

@Injectable()
export class SongFileService {
  constructor(private readonly minioService: MinioService) {}

  async upload(title: string, albumUrl: string, file: Express.Multer.File) {
    const fileSlug = slugify(title);
    const key = `${albumUrl}/${fileSlug}`;

    await this.minioService.upload(key, file.buffer, file.mimetype);

    return key;
  }

  async delete(key: string) {
    await this.minioService.delete(key);
  }
}
