import { Type } from "class-transformer";
import { IsInt, IsOptional, Max, Min } from "class-validator";

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;

export class PageOptionsDto {
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  @Min(1)
  page = DEFAULT_PAGE;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  @Max(50)
  limit = DEFAULT_LIMIT;
}
