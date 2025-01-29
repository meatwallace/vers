import { factory, nullable, primaryKey } from '@mswjs/data';
import { createId } from '@paralleldrive/cuid2';

// TODO: extract & centralise
export const db = factory({
  session: {
    id: primaryKey(() => createId()),
    userID: () => createId(),
    refreshToken: () => 'refresh_token',
    ipAddress: () => '127.0.0.1',
    expiresAt: () => new Date(),
    createdAt: () => new Date(),
    updatedAt: () => new Date(),
  },
  user: {
    id: primaryKey(() => createId()),
    email: () => 'user@test.com',
    name: () => 'Test User',
    username: () => 'test_user',
    passwordHash: nullable(() => null),
    createdAt: () => new Date(),
    updatedAt: () => new Date(),
  },
  verification: {
    id: primaryKey(() => createId()),
    type: () => 'onboarding',
    target: () => 'test@example.com',
    createdAt: () => new Date(),
    // 5 mins
    expiresAt: () => new Date(Date.now() + 1000 * 60 * 5),
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
    createdAt: () => new Date(),
    updatedAt: () => new Date(),
  },
});
