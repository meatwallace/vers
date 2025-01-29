import { ServiceResponse } from './service-response';

export type CreateUserRequest = {
  email: string;
  name: string;
  username: string;
  password: string;
};

export type CreateUserResponse = ServiceResponse<{
  id: string;
  email: string;
  name: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}>;

export type GetUserRequest = {
  id?: string;
  email?: string;
};

export type GetUserResponse = ServiceResponse<{
  id: string;
  email: string;
  name: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
} | null>;

export type VerifyPasswordRequest = {
  email: string;
  password: string;
};

export type VerifyPasswordResponse = ServiceResponse<Record<string, never>>;
