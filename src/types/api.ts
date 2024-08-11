export interface IReponse<T> {
  errorMessage?: string;
  data: T;
  status: number;
}
