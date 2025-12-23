import { Injectable } from "@nestjs/common";
import { nanoid } from "nanoid";

import { MinioService } from "minio/services/minio.service";

@Injectable()
export class ArtistArtworkService {
  constructor(private readonly minioService: MinioService) {}

  async upload(name: string, artwork: Express.Multer.File) {
    const key = `artists/artworks/${name}-${nanoid(6)}`;

    await this.minioService.upload(key, artwork.buffer, artwork.mimetype);

    return key;
  }

  async delete(key: string) {
    await this.minioService.delete(key);
  }
}
