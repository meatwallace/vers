import { createMockServices } from '../test-utils/create-mock-services';
import { isAuthed } from './is-authed';

const services = createMockServices();

test('it returns true if an access token is found', () => {
  const request = new Request('https://test.com/', {
    headers: {
      authorization: 'Bearer token',
    },
  });

  const authed = isAuthed({ request, services });

  expect(authed).toBeTrue();
});

test('it returns false if an access token isnt found', () => {
  const request = new Request('https://test.com/', {});

  const authed = isAuthed({ request, services });

  expect(authed).toBeFalse();
});
