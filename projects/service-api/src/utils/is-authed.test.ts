import { expect, test } from 'vitest';
import { createMockGQLContext } from '../test-utils/create-mock-gql-context';
import { isAuthed } from './is-authed';

test('it returns true if it is an authed request', () => {
  const user = {
    createdAt: new Date(),
    email: 'user@test.com',
    id: 'test-id',
    name: 'Test User',
    updatedAt: new Date(),
    username: 'test_user',
  };

  const session = {
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    id: 'test-session-id',
    ipAddress: '127.0.0.1',
    updatedAt: new Date(),
    userID: 'test-user-id',
  };

  const context = createMockGQLContext({
    accessToken: 'Bearer token',
    session,
    user,
  });

  const authed = isAuthed(context);

  expect(authed).toBeTrue();
});

test(`it returns false if there is no user`, () => {
  const session = {
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    id: 'test-session-id',
    ipAddress: '127.0.0.1',
    updatedAt: new Date(),
    userID: 'test-user-id',
  };

  const context = createMockGQLContext({
    accessToken: 'Bearer token',
    session,
  });

  const authed = isAuthed(context);

  expect(authed).toBeFalse();
});

test(`it returns false if there is no session`, () => {
  const user = {
    createdAt: new Date(),
    email: 'user@test.com',
    id: 'test-id',
    name: 'Test User',
    updatedAt: new Date(),
    username: 'test_user',
  };

  const context = createMockGQLContext({
    accessToken: 'Bearer token',
    user,
  });

  const authed = isAuthed(context);

  expect(authed).toBeFalse();
});
