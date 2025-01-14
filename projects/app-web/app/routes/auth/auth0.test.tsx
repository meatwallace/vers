import { redirect } from 'react-router';
import { loader, action } from './auth0';

const { authenticateMock } = vi.hoisted(() => ({
  authenticateMock: vi.fn(),
}));

vi.mock('../../authenticator.server', async (importOriginal) => {
  const original =
    await importOriginal<typeof import('../../authenticator.server')>();

  const authenticator = {
    ...original.authenticator,
    authenticate: authenticateMock,
  };

  return { authenticator };
});

test('it authenticates the user', async () => {
  const request = new Request('https://test.com/');
  const params = {};
  const context = {};

  await action({ request, params, context });

  expect(authenticateMock).toBeCalled();
});

test('it redirects to the login page', () => {
  const response = loader();

  expect(response).toEqual(redirect('/login'));
});
