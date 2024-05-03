import { redirect } from '@remix-run/node';
import { action } from './logout';
import { sessionStorage } from '../../session-storage.server';
import { authenticator } from '../../authenticator.server';

test('it redirects to the logout URL with the correct headers', async () => {
  const request = new Request('https://test.com/');
  const params = {};
  const context = {};

  request.headers.set('cookie', 'session=1');

  const session = await sessionStorage.getSession('session=1');

  session.set(authenticator.sessionKey, '1');

  const response = await action({ request, params, context });

  expect(request.headers.get('set-cookie')).toBeNull();
  expect(response).toEqual(
    redirect(
      'https://auth0.com/v2/logout?client_id=auth0_client_id&returnTo=https%3A%2F%2Ftest.com',
    ),
  );
});
