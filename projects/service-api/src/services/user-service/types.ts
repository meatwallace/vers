import { users } from '@chrono/postgres-schema';
import {
  ChangePasswordRequest,
  CreatePasswordResetTokenRequest,
  GetUserRequest,
  CreateUserRequest,
  VerifyPasswordRequest,
} from '@chrono/service-types';
import { ServiceContext } from '../utils/types';

export type UserServiceContext = ServiceContext;

export type UserData = Omit<
  typeof users.$inferSelect,
  'passwordHash' | 'passwordResetToken' | 'passwordResetTokenExpiresAt'
>;

export type VerifyPasswordPayload =
  | { success: false; error: string }
  | { success: true };

export type UserService = {
  changePassword: (args: ChangePasswordRequest) => Promise<true>;

  createPasswordResetToken: (
    args: CreatePasswordResetTokenRequest,
  ) => Promise<string>;

  createUser: (args: CreateUserRequest) => Promise<UserData>;

  getUser: (args: GetUserRequest) => Promise<UserData | null>;

  verifyPassword: (
    args: VerifyPasswordRequest,
  ) => Promise<VerifyPasswordPayload>;
};
