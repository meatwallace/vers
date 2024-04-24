import { Context, Hono } from 'hono';
import { getUserFromContext } from './get-user-from-context';

function setupTest() {
  const app = new Hono();

  return { app };
}

test('it extracts the user from the context', async () => {
  const { app } = setupTest();

  const jwtPayload = {
    sub: 'test_id',
    email: 'user@test.com',
    email_verified: 'true',
    name: 'Test User',
  };

  app.get('/test', (ctx: Context) => {
    ctx.set('jwtPayload', jwtPayload);

    const user = getUserFromContext(ctx);

    return ctx.json({ user });
  });

  const req = new Request('http://localhost/test');
  const res = await app.request(req);

  expect(res.status).toBe(200);
  expect(await res.json()).toMatchObject({
    user: {
      id: 'test_id',
      email: 'user@test.com',
      emailVerified: true,
      name: 'Test User',
    },
  });
});

test('it throws a 401 error if no token was provided', async () => {
  const { app } = setupTest();

  app.get('/test', (ctx: Context) => {
    const user = getUserFromContext(ctx);

    return ctx.json({ user });
  });

  const req = new Request('http://localhost/test');
  const res = await app.request(req);

  expect(await res.text()).toBe('Unauthorized');
  expect(res.status).toBe(401);
});
