import { PageMetaDto } from "./page-meta.dto";

export class PageDto<T> {
  public readonly data: T[];
  public readonly meta: PageMetaDto;

  constructor(data: T[], meta: PageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
