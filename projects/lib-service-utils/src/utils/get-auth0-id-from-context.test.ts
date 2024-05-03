import { Context, Hono } from 'hono';
import { getAuth0IDFromContext } from './get-auth0-id-from-context';

function setupTest() {
  const app = new Hono();

  return { app };
}

test('it extracts the auth0 user ID from the context', async () => {
  const { app } = setupTest();

  const jwtPayload = {
    sub: 'test_id',
  };

  app.get('/test', (ctx: Context) => {
    ctx.set('jwtPayload', jwtPayload);

    const userID = getAuth0IDFromContext(ctx);

    return ctx.json({ userID });
  });

  const req = new Request('http://localhost/test');
  const res = await app.request(req);

  expect(res.status).toBe(200);
  expect(await res.json()).toMatchObject({ userID: 'test_id' });
});

test('it throws a 401 error if no token was provided', async () => {
  const { app } = setupTest();

  app.get('/test', (ctx: Context) => {
    const userID = getAuth0IDFromContext(ctx);

    return ctx.json({ userID });
  });

  const req = new Request('http://localhost/test');
  const res = await app.request(req);

  expect(await res.text()).toBe('Unauthorized');
  expect(res.status).toBe(401);
});
