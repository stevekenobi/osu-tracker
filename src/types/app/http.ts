export type RequestQuery = {
  [key: string]: string;
};

export type ServerResponse<T> = {
  data: T;
  meta: {
    status: number;
  };
};
