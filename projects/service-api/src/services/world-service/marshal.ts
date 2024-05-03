import { worlds } from '@chrononomicon/postgres-schema';
import { RawWorldData } from './types';

export function marshal(rawWorld: RawWorldData): typeof worlds.$inferSelect {
  return {
    ...rawWorld,
    createdAt: new Date(rawWorld.createdAt),
    updatedAt: new Date(rawWorld.updatedAt),
  };
}
