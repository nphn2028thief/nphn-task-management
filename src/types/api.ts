export interface IResponse<T> {
  errorMessage?: string;
  data: T;
  status: number;
}
