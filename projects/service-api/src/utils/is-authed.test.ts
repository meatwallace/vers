import { expect, test } from 'vitest';
import { createMockServices } from '../test-utils/create-mock-services';
import { isAuthed } from './is-authed';

const services = createMockServices();

test('it returns true if it is an authed request', () => {
  const request = new Request('https://test.com/', {
    headers: {
      authorization: 'Bearer token',
    },
  });

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

  const authed = isAuthed({ request, services, session, user });

  expect(authed).toBeTrue();
});

test(`it returns false if there is no user`, () => {
  const request = new Request('https://test.com/', {});

  const session = {
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    id: 'test-session-id',
    ipAddress: '127.0.0.1',
    updatedAt: new Date(),
    userID: 'test-user-id',
  };

  const authed = isAuthed({ request, services, session, user: null });

  expect(authed).toBeFalse();
});

test(`it returns false if there is no session`, () => {
  const request = new Request('https://test.com/', {});

  const user = {
    createdAt: new Date(),
    email: 'user@test.com',
    id: 'test-id',
    name: 'Test User',
    updatedAt: new Date(),
    username: 'test_user',
  };

  const authed = isAuthed({ request, services, session: null, user });

  expect(authed).toBeFalse();
});
