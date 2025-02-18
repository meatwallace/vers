import { ServiceResponse } from './service-response';

export type UserData = {
  id: string;
  email: string;
  name: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateUserRequest = {
  email: string;
  name: string;
  username: string;
  password: string;
};

export type CreateUserResponse = ServiceResponse<UserData>;

export type GetUserRequest = {
  id?: string;
  email?: string;
};

export type GetUserResponse = ServiceResponse<UserData | null>;

export type VerifyPasswordRequest = {
  email: string;
  password: string;
};

export type VerifyPasswordResponse = ServiceResponse<Record<string, never>>;

export type ChangePasswordRequest = {
  id: string;
  password: string;
  resetToken: string;
};

export type ChangePasswordResponse = ServiceResponse<Record<string, never>>;

export type CreatePasswordResetTokenRequest = {
  id: string;
};

export type CreatePasswordResetTokenResponse = ServiceResponse<{
  resetToken: string;
}>;
