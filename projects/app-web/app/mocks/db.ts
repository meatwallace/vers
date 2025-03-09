import { factory, nullable, primaryKey } from '@mswjs/data';
import { createId } from '@paralleldrive/cuid2';
import { VerificationType } from '~/gql/graphql';
import { encodeMockJWT } from './utils/encode-mock-jwt';

const EXPIRATION_IN_MS = 1000 * 60 * 60 * 24; // 1 day

export const db = factory({
  session: {
    id: primaryKey(() => createId()),
    userID: () => createId(),
    createdAt: () => new Date().toISOString(),
    refreshToken: () =>
      encodeMockJWT({
        sub: createId(),
        exp: Date.now() + EXPIRATION_IN_MS,
      }),
    expiresAt: () => new Date(Date.now() + EXPIRATION_IN_MS).toISOString(),
  },
  verification: {
    id: primaryKey(() => createId()),
    target: () => 'user@test.com',
    type: () => VerificationType.Onboarding,
    createdAt: () => new Date().toISOString(),
  },
  user: {
    id: primaryKey(() => createId()),
    email: () => 'user@test.com',
    username: () => 'test_user',
    name: () => 'John Smith',
    password: () => 'password',
    createdAt: () => new Date().toISOString(),
    updatedAt: () => new Date().toISOString(),
  },
  world: {
    id: primaryKey(() => createId()),
    ownerID: () => createId(),
    name: () => 'New World',
    fantasyType: () => 'Medium',
    technologyLevel: () => 'Medieval',
    archetype: nullable<string>(() => null),
    atmosphere: () => 'Neutral',
    population: () => 'Average',
    geographyType: () => 'Supercontinent',
    geographyFeatures: () => [
      'Deserts',
      'Forest',
      'Mountains',
      'Plains',
      'Swamps',
      'Tundra',
    ],
    createdAt: () => new Date().toISOString(),
    updatedAt: () => new Date().toISOString(),
  },
});
