import { users } from '@chrono/postgres-schema';
import {
  GetUserRequest,
  CreateUserRequest,
  VerifyPasswordRequest,
} from '@chrono/service-types';
import { ServiceContext } from '../utils/types';

export type UserServiceContext = ServiceContext;

export type UserData = Omit<typeof users.$inferSelect, 'passwordHash'>;

type VerifyPasswordErrorPayload = {
  success: false;
  error: string;
};

type VerifyPasswordSuccessPayload = {
  success: true;
};

export type VerifyPasswordPayload =
  | VerifyPasswordErrorPayload
  | VerifyPasswordSuccessPayload;

export type UserService = {
  createUser: (args: CreateUserRequest) => Promise<UserData>;

  getUser: (args: GetUserRequest) => Promise<UserData | null>;

  verifyPassword: (
    args: VerifyPasswordRequest,
  ) => Promise<VerifyPasswordPayload>;
};
