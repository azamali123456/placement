export class PageDto {
  readonly total: number;
  readonly data: [];

  constructor(total: number, data: []) {
    this.total = total;
    this.data = data;
  }
}
