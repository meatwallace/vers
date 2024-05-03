export type ServiceResponse<T> =
  | ServiceSuccessResponse<T>
  | ServiceErrorResponse;

export type ServiceSuccessResponse<T> = {
  success: true;
  data: T;
};

export type ServiceErrorResponse = {
  success: false;
  reason: string;
};
