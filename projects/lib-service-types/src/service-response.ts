export type ServiceResponseError = {
  success: false;
  error: string;
};

type ServiceResponseSuccess<T> = {
  success: true;
  data: T;
};

export type ServiceResponse<T> =
  | ServiceResponseError
  | ServiceResponseSuccess<T>;
