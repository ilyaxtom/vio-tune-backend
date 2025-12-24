import { applyDecorators, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes } from "@nestjs/swagger";

export function FileUpload(field: string, required = true) {
  return applyDecorators(
    UseInterceptors(FileInterceptor(field)),
    ApiConsumes("multipart/form-data"),
    ApiBody({
      required,
      schema: {
        type: "object",
        properties: {
          name: { type: "string", example: "Marilyn Manson" },
          country: { type: "string", example: "USA" },
          [field]: { type: "string", format: "binary" },
        },
      },
    }),
  );
}
