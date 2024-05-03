import { users } from '@chrononomicon/postgres-schema';
import { ServiceContext } from '../utils/types';

export type RawUserData = {
  id: string;
  auth0ID: string;
  email: string;
  emailVerified: boolean;
  name: string;
  firstName?: string;
  createdAt: string;
};

export type userServiceContext = ServiceContext;

export type UserService = {
  getCurrentUser: (
    args: GetCurrentUserArgs,
  ) => Promise<typeof users.$inferSelect>;

  getOrCreateUser: (
    args: GetOrCreateUserArgs,
  ) => Promise<typeof users.$inferSelect>;
};

export type GetCurrentUserArgs = Record<PropertyKey, never>;

export type GetOrCreateUserArgs = {
  email: string;
};
