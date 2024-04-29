import { Context, Hono } from 'hono';
import { getTokenFromContext } from './get-token-from-context';

function setupTest() {
  const app = new Hono();

  return { app };
}

test('it extracts the token from the context', async () => {
  const { app } = setupTest();

  app.get('/test', (ctx: Context) => {
    ctx.set('token', 'abc123');

    const token = getTokenFromContext(ctx);

    return ctx.json({ token });
  });

  const req = new Request('http://localhost/test');
  const res = await app.request(req);

  expect(res.status).toBe(200);
  expect(await res.json()).toMatchObject({ token: 'abc123' });
});

test('it throws a 401 error if no token was provided', async () => {
  const { app } = setupTest();

  app.get('/test', (ctx: Context) => {
    const token = getTokenFromContext(ctx);

    return ctx.json({ token });
  });

  const req = new Request('http://localhost/test');
  const res = await app.request(req);

  expect(await res.text()).toBe('Unauthorized');
  expect(res.status).toBe(401);
});
