import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class RequiredFilePipe implements PipeTransform {
  transform(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException("File is required");
    }

    if (file.size === 0) {
      throw new BadRequestException("File is empty");
    }

    return file;
  }
}
