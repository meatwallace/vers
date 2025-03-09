import { Jsonify } from 'type-fest';
import { SessionData } from './types';

export function marshal(raw: Jsonify<SessionData>): SessionData {
  return {
    createdAt: new Date(raw.createdAt),
    expiresAt: new Date(raw.expiresAt),
    id: raw.id,
    ipAddress: raw.ipAddress,
    updatedAt: new Date(raw.updatedAt),
    userID: raw.userID,
  };
}
