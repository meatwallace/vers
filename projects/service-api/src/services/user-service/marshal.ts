import { UserData } from '@vers/service-types';
import { Jsonify } from 'type-fest';

export function marshal(data: Jsonify<UserData>): UserData {
  return {
    ...data,
    createdAt: new Date(data.createdAt),
    updatedAt: new Date(data.updatedAt),
  };
}
