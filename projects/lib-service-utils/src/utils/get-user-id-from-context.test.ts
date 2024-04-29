import { Context, Hono } from 'hono';
import { getUserIDFromContext } from './get-user-id-from-context';

function setupTest() {
  const app = new Hono();

  return { app };
}

test('it extracts the user from the context', async () => {
  const { app } = setupTest();

  const jwtPayload = {
    sub: 'test_id',
  };

  app.get('/test', (ctx: Context) => {
    ctx.set('jwtPayload', jwtPayload);

    const userID = getUserIDFromContext(ctx);

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
    const userID = getUserIDFromContext(ctx);

    return ctx.json({ userID });
  });

  const req = new Request('http://localhost/test');
  const res = await app.request(req);

  expect(await res.text()).toBe('Unauthorized');
  expect(res.status).toBe(401);
});
