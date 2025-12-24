import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { fileTypeFromBuffer } from "file-type";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

@Injectable()
export class ValidateArtworkPipe implements PipeTransform {
  async transform(file: Express.Multer.File) {
    // todo: refactor pipes: convert images
    if (!file) {
      return file;
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException("Max file size is 5MB");
    }

    const type = await fileTypeFromBuffer(file.buffer);

    if (!type || !type.mime.startsWith("image/")) {
      throw new BadRequestException("Invalid file type");
    }

    return file;
  }
}
