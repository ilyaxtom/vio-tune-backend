import { ArgumentsHost, Catch, HttpStatus } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { Prisma } from "@prisma/client";
import type { Request, Response } from "express";

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const username = request.params.username;

    switch (exception.code) {
      case "P2025":
        response.status(HttpStatus.NOT_FOUND).json({
          message: username
            ? `User with username ${username} not found`
            : "Resource not found",
          error: "Not Found",
          statusCode: HttpStatus.NOT_FOUND,
        });
        break;

      case "P2002": {
        let message: string;
        const modelName = exception.meta?.modelName as string;
        const fieldName = this.getFieldName(exception);

        if (fieldName && modelName) {
          message = `${modelName} with such ${this.getFieldName(exception)} already exists`;
        } else if (modelName) {
          message = `${modelName} already exists`;
        } else {
          message = "Failed to create entity";
        }

        response.status(HttpStatus.CONFLICT).json({
          statusCode: HttpStatus.CONFLICT,
          message,
          error: "Conflict",
        });
        break;
      }

      default:
        super.catch(exception, host);
        break;
    }
  }

  private getFieldName(exception: Prisma.PrismaClientKnownRequestError) {
    return (exception.meta?.driverAdapterError as any)?.cause?.constraint
      ?.fields[0] as string;
  }
}
