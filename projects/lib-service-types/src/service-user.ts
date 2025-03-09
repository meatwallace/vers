import { ServiceResponse } from './service-response';

export interface UserData {
  id: string;
  email: string;
  name: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserRequest {
  email: string;
  name: string;
  username: string;
  password: string;
}

export type CreateUserResponse = ServiceResponse<UserData>;

export interface GetUserRequest {
  id?: string;
  email?: string;
}

export type GetUserResponse = ServiceResponse<UserData | null>;

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
  id: string;
  email?: string;
  name?: string;
  username?: string;
}

export type UpdateUserResponse = ServiceResponse<{
  updatedID: string;
}>;
