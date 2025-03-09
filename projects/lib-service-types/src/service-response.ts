export interface ServiceResponseError {
  success: false;
  error: string;
}

interface ServiceResponseSuccess<T> {
  success: true;
  data: T;
}

export type ServiceResponse<T> =
  | ServiceResponseError
  | ServiceResponseSuccess<T>;
