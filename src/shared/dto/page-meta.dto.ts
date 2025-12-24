import { PageOptionsDto } from "./page-options.dto";

export class PageMetaDto {
  readonly page: number;
  readonly limit: number;
  readonly pageCount: number;
  readonly itemCount: number;
  readonly hasNextPage: boolean;
  readonly hasPreviousPage: boolean;

  constructor(pageOptions: PageOptionsDto, itemsCount: number) {
    this.page = pageOptions.page;
    this.limit = pageOptions.limit;
    this.itemCount = itemsCount;
    this.pageCount =
      this.itemCount === 0 ? 1 : Math.ceil(this.itemCount / this.limit);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}
