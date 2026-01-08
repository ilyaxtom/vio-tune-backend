import { Injectable } from "@nestjs/common";

import { MinioService } from "minio/services/minio.service";
import { slugify } from "shared/utils/slugify";

@Injectable()
export class AlbumArtworkService {
  constructor(private readonly minioService: MinioService) {}

  async upload(name: string, artwork: Express.Multer.File) {
    const albumSlug = slugify(name);
    const key = `albums/${albumSlug}/artwork/${albumSlug}`;

    await this.minioService.upload(key, artwork.buffer, artwork.mimetype);

    return key;
  }

  async delete(key: string) {
    await this.minioService.delete(key);
  }
}
