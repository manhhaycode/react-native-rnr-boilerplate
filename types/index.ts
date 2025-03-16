export interface IResponse<T = any> {
  data: T;
  code: number;
  message: string;
}

export interface IReqPagination {
  page: number;
  limit: number;
}

export interface IPagination<T> {
  data: T[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;
}

export type IResPagination<T> = IResponse<IPagination<T>>;
