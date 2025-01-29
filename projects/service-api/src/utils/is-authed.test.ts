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

  const authed = isAuthed({ request, user, services });

  expect(authed).toBeTrue();
});

test(`it returns false if it isn't an authed request`, () => {
  const request = new Request('https://test.com/', {});

  const authed = isAuthed({ request, user: null, services });

  expect(authed).toBeFalse();
});
