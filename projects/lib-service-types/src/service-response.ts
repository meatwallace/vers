export interface ServiceResponseError {
  error: string;
  success: false;
}

interface ServiceResponseSuccess<T> {
  data: T;
  success: true;
}

export type ServiceResponse<T> =
  | ServiceResponseError
  | ServiceResponseSuccess<T>;
