import { factory, primaryKey } from '@mswjs/data';

export const db = factory({
  user: {
    id: primaryKey(() => 'test_id'),
    auth0ID: () => 'auth0|test_id',
    email: () => 'user@test.com',
    emailVerified: () => true,
    name: () => 'Test User',
    firstName: () => 'John',
    createdAt: () => new Date(),
  },
});
