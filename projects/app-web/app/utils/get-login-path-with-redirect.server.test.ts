import { expect, test } from 'vitest';
import { getLoginPathWithRedirect } from './get-login-path-with-redirect.server';

test('it returns the login path with the redirect query param', () => {
  const request = new Request('http://localhost:3000/query?foo=bar', {});

  const result = getLoginPathWithRedirect(request);

  expect(result).toBe('/login?redirect=%2Fquery%3Ffoo%3Dbar');
});
