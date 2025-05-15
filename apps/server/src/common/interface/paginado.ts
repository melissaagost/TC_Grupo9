export interface Paginado<T> {
  data: T[];
  total: number;
  pageIndex: number;
  pageSize: number;
}
