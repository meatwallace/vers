import { Context, Hono } from 'hono';
import createJWKSMock from 'mock-jwks';
import { createAuthMiddleware } from './create-auth-middleware';

const TEST_TOKEN_PAYLOAD = {
  sub: 'test_id',
  iss: `https://test.com/`,
};

const jwks = createJWKSMock(`https://test.com/`);

const testHandlerSpy = vi.fn(async (ctx: Context) => {
  return ctx.json({ payload: ctx.get('jwtPayload') });
});

const authMiddleware = createAuthMiddleware({
  tokenVerifierConfig: {
    audience: '',
    issuer: 'https://test.com/',
  },
});

function setupTest() {
  const app = new Hono();

  jwks.start();
  app.use('/test', authMiddleware, testHandlerSpy);

  const token = jwks.token(TEST_TOKEN_PAYLOAD);

  return { app, token };
}

afterEach(() => {
  jwks.stop();
  vi.restoreAllMocks();
});

test('it authorizes a valid token and extracts the payload', async () => {
  const { app, token } = setupTest();

  const req = new Request('http://localhost/test');

  req.headers.set('Authorization', `Bearer ${token}`);

  const res = await app.request(req);

  expect(testHandlerSpy).toHaveBeenCalled();
  expect(await res.json()).toMatchObject({ payload: TEST_TOKEN_PAYLOAD });
  expect(res.status).toBe(200);
});

test('it returns a 401 if no token is provided', async () => {
  const { app } = setupTest();

  const req = new Request('http://localhost/test');
  const res = await app.request(req);

  expect(testHandlerSpy).not.toHaveBeenCalled();
  expect(await res.text()).toBe('Unauthorized');
  expect(res.status).toBe(401);
});

test('it rejects an invalid authorization header', async () => {
  const { app } = setupTest();

  const req = new Request('http://localhost/test');

  req.headers.set('Authorization', `Bearer`);

  const res = await app.request(req);

  expect(testHandlerSpy).not.toHaveBeenCalled();
  expect(await res.text()).toBe('Unauthorized');
  expect(res.status).toBe(401);
  expect(res.headers.get('www-authenticate')).toMatchInlineSnapshot(
    `"Bearer realm="http://localhost/test",error="invalid_request",error_description="invalid authorization header structure""`,
  );
});

test('it rejects an invalid token', async () => {
  const { app } = setupTest();

  const req = new Request('http://localhost/test');

  req.headers.set('Authorization', `Bearer abcd1234`);

  const res = await app.request(req);

  expect(testHandlerSpy).not.toHaveBeenCalled();
  expect(await res.text()).toBe('Unauthorized');
  expect(res.status).toBe(401);
  expect(res.headers.get('www-authenticate')).toMatchInlineSnapshot(
    `"Bearer realm="http://localhost/test",error="invalid_token",error_description="token verification failure""`,
  );
});
