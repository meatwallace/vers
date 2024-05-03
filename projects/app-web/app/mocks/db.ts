import { factory, nullable, primaryKey } from '@mswjs/data';
import { createId } from '@paralleldrive/cuid2';

export const db = factory({
  user: {
    id: primaryKey(() => createId()),
    auth0ID: () => 'auth0|test_id',
    email: () => 'user@test.com',
    emailVerified: () => true,
    name: () => 'John Smith',
    firstName: () => 'John',
    createdAt: () => new Date(),
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
