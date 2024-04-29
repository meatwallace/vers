import { createMockServices } from '../test-utils/create-mock-services';
import { getTokenFromContext } from './get-token-from-context';

const services = createMockServices();

test('it extracts the token from the context', () => {
  const request = new Request('https://test.com/', {
    headers: {
      authorization: 'Bearer token',
    },
  });

  const token = getTokenFromContext({ request, services });

  expect(token).toEqual('token');
});

test('it returns null if the token is not present', () => {
  const request = new Request('https://test.com/', {});

  const token = getTokenFromContext({ request, services });

  expect(token).toEqual(null);
});
