import { Jsonify } from 'type-fest';
import { UserData } from './types';

export function marshal(rawUser: Jsonify<UserData>): UserData {
  return {
    ...rawUser,
    createdAt: new Date(rawUser.createdAt),
    updatedAt: new Date(rawUser.updatedAt),
  };
}
