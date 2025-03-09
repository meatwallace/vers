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
    id: 'test-id',
    email: 'user@test.com',
    name: 'Test User',
    username: 'test_user',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const session = {
    id: 'test-session-id',
    userID: 'test-user-id',
    ipAddress: '127.0.0.1',
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const authed = isAuthed({ request, user, session, services });

  expect(authed).toBeTrue();
});

test(`it returns false if there is no user`, () => {
  const request = new Request('https://test.com/', {});

  const session = {
    id: 'test-session-id',
    userID: 'test-user-id',
    ipAddress: '127.0.0.1',
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const authed = isAuthed({ request, user: null, session, services });

  expect(authed).toBeFalse();
});

test(`it returns false if there is no session`, () => {
  const request = new Request('https://test.com/', {});

  const user = {
    id: 'test-id',
    email: 'user@test.com',
    name: 'Test User',
    username: 'test_user',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const authed = isAuthed({ request, user, session: null, services });

  expect(authed).toBeFalse();
});
