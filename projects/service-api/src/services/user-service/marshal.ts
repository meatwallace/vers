import { users } from '@chrononomicon/postgres-schema';
import { RawUserData } from './types';

type UserData = typeof users.$inferSelect;

export function marshal(rawUser: RawUserData): UserData {
  return {
    ...rawUser,
    firstName: rawUser.firstName ?? null,
    createdAt: new Date(rawUser.createdAt),
  };
}
