import { Injectable } from "@nestjs/common";
import { nanoid } from "nanoid";
import slugify from "slugify";

import { MinioService } from "minio/services/minio.service";

@Injectable()
export class ArtistArtworkService {
  constructor(private readonly minioService: MinioService) {}

  async upload(name: string, artwork: Express.Multer.File) {
    const fileName = slugify(name, { lower: true, strict: true });
    const key = `artists/artworks/${slugify(fileName)}-${nanoid(6)}`;

    await this.minioService.upload(key, artwork.buffer, artwork.mimetype);

    return key;
  }

  async delete(key: string) {
    await this.minioService.delete(key);
  }
}
