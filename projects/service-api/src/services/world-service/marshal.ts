import { worlds } from '@chrono/postgres-schema';
import { RawWorldData } from './types';

export function marshal(rawWorld: RawWorldData): typeof worlds.$inferSelect {
  // @ts-expect-error(#37): marshal with zod for nice types
  return {
    ...rawWorld,
    createdAt: new Date(rawWorld.createdAt),
    updatedAt: new Date(rawWorld.updatedAt),
  };
}
