import { redirect } from 'react-router';
import { loader } from './callback';

const { authenticateMock } = vi.hoisted(() => ({
  authenticateMock: vi.fn(async () => ({ id: 'test_id' })),
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

test('it redirects to the dashboard with the correct headers', async () => {
  const request = new Request('https://test.com/');
  const params = {};
  const context = {};

  const response = await loader({ request, params, context });

  expect(request.headers.get('set-cookie')).toBeNull();
  expect(response).toEqual(redirect('/dashboard'));
});
