import { ClientError } from 'graphql-request';
import { handle401Error } from './handle-401-error';
import * as logoutModule from './logout.server';

const logoutSpy = vi.spyOn(logoutModule, 'logout');

afterEach(() => {
  vi.restoreAllMocks();
});

test('it logs the user out and redirects to the login page when the error is a 401', async () => {
  const request = new Request('http://localhost:3000/dashboard');
  const error = new ClientError({ status: 401 }, { query: '' });

  await expect(handle401Error(request, error)).rejects.toMatchObject(
    new Response(null, {
      headers: {
        Location: '/login?redirect=%2Fdashboard%3F',
      },
      status: 302,
    }),
  );

  expect(logoutSpy).toHaveBeenCalledOnce();
});

test('it does not log out the user when the error is not a 401', async () => {
  const request = new Request('http://localhost:3000/dashboard');
  const error = new ClientError({ status: 500 }, { query: '' });

  await expect(handle401Error(request, error)).resolves.toBeUndefined();

  expect(logoutSpy).not.toHaveBeenCalled();
});
