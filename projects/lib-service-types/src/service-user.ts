import { ServiceResponse } from './service-response';

export interface UserData {
  createdAt: Date;
  email: string;
  id: string;
  name: string;
  updatedAt: Date;
  username: string;
}

export interface CreateUserRequest {
  email: string;
  name: string;
  password: string;
  username: string;
}

export type CreateUserResponse = ServiceResponse<UserData>;

export interface GetUserRequest {
  email?: string;
  id?: string;
}

export type GetUserResponse = ServiceResponse<null | UserData>;

export interface VerifyPasswordRequest {
  email: string;
  password: string;
}

export type VerifyPasswordResponse = ServiceResponse<Record<string, never>>;

export interface ChangePasswordRequest {
  id: string;
  password: string;
  resetToken: string;
}

export type ChangePasswordResponse = ServiceResponse<Record<string, never>>;

export interface CreatePasswordResetTokenRequest {
  id: string;
}

export type CreatePasswordResetTokenResponse = ServiceResponse<{
  resetToken: string;
}>;

export interface UpdateUserRequest {
  email?: string;
  id: string;
  name?: string;
  username?: string;
}

export type UpdateUserResponse = ServiceResponse<{
  updatedID: string;
}>;
