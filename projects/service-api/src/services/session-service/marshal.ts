import { Jsonify } from 'type-fest';
import { SessionData } from './types';

export function marshal(raw: Jsonify<SessionData>): SessionData {
  return {
    id: raw.id,
    userID: raw.userID,
    ipAddress: raw.ipAddress,
    expiresAt: new Date(raw.expiresAt),
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
  };
}
