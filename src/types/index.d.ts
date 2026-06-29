type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

type TGetResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T;
};

type TErrorResponse = {
  message: string
}

type OrderingFields<T> = keyof T | `-${keyof T & string}`
