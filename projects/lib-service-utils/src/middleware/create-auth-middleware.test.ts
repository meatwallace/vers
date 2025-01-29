import * as jose from 'jose';
import { Context, Hono } from 'hono';
import { createTestJWT } from '@chrono/service-test-utils';
import { createAuthMiddleware } from './create-auth-middleware';

const TEST_TOKEN_PAYLOAD = {
  sub: 'test_id',
  iss: `https://test.com/`,
};

const TEST_SIGNING_KEY = `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCycqrsL1e68FB9
g3n6URD/ExjpPZSRmQbIjR+FlWbwQsVzoAJ6dG9VtSmj1jfVDtZeFo7CFgnFP77B
pn+ATG4ULnKPVVf9KEf4qi3NJIn3aCMSfwxPn/7UuonFm/b63wnCtVp76iogPXa+
boPSUCMS+/oORJ37RE39SdRIKb4w8TeJiCvBZHuPpTA7wNCzEz49qPQhyCpMFseO
0d5Tdp8tBdKoLuCirc1pLPE/4MiexpMaa5FfkxmlBQAObjj0IZ7R8Pozyh+shDhQ
6DdH99GvGhAvoiNTZ5aZ9fqthBoVgM7HWHjtMZ8xHcTU6Ex9z0dLtrdZ2tB9lSLx
bzsWopTLAgMBAAECggEATjRdvwOihZ1DETa5EuBLPBZxAOsJfOOdKvBaI6+NvPbu
VNWHsIXtsxihppk/v8JwZSyqpNmGr6jXn0OqNh6I0ZRnhXSICr0ICaz/RJviUQiU
8kq2qQC77BvSPEW1cE2mF+xlus+tZZK6Qwvo/pc7P9spQ+6Dc/aD3WDpRTTyEr0u
8matmHtR+KFKQ+IGP8ql/JWpXfjKbqNERI/9uOt4DQMw5KMlHyuVs6fK9OQFn4sp
K6N0COVwgdEt+gAHmkow8QEewcY0jubglQ7Xni7zjv0TFTY7I9hqWI+XUvUxu4mS
avcyv4Wqct475sAt8AgNddOaTWeF85SUaMSnTBDxoQKBgQD2iEnoG08Cump77F5d
0/IfznMRifTN6rEjddkegwCNj17w3oaRR2wsVu0BdYz5EkQ8JT5ooafpveKAlB/u
UksVwfw3770t4nOtSUshgZoYnxaxolz0R99RIjmWJAYHIaNuE4bmgRvsGfrI0HNy
ieY2ZAmXaRH/4YxozxRCD/K+qwKBgQC5TQbFU0NpNWQtpe72wLEXT4pmfl5AW6jd
dblzI7H86kWb2hoZC66coDyf2vNetjquI6zlmsrFTs1lj6KQlHqgAxSYK3flMIf5
tbO+yVMdMsBInAcWQb3meKHa0IjrcDpKBuW7TzmCMBnRvORLskzxWnf1/+BCAa4E
iK2bNoECYQKBgC3Gxrpjf7tI9AbIsAkKFtZTFki2bg9iObwU4NjqiErAyWc+WoxV
T7+38FAqDKAfBS6J19nD0pLzYEBxwLAW9bw3hea5DE6d0s7lYh75mqxhtewL8uil
A9Fj4n9/duMSGu+Qjqb0aEPh2xA4rIcjFe0ZjDJiHyZ9Mf4wHVna7j77AoGAPjBu
xE0Eg8vKelOFVsUm6ibk0S86HKlmjCTVf6IMO1C42eyh86PrD1/r2M6X/UJ1gTox
7cE8qmmfH6XMLm/Wk9tUzxlPnNjj2de0oqRYw6Tjybqr2jloLXBxCcoRGctJlMyp
z2pwZ5QTJkQZ7pnBnwL43dPphN2hdJ4WfdAWDiECgYBJ+o1Tb61OKMnbWOkBeOcg
LXzqIDpWE0IvzZf40jW7bzPgJrMBuDD4INMSa6P75apoJnqWg1NzuXBdph7/XZuo
2YLcTllr8Lb/6UgEMGUSLEkDc0AtpPpUDx5oUpkdV2ObN67PqXoh95RT2D8dMJuB
1fK6UKj8xO3Tfqz8JcEzDw==
-----END PRIVATE KEY-----
`;

const testHandlerSpy = vi.fn(async (ctx: Context) => {
  return ctx.json({
    payload: ctx.get('jwtPayload'),
    userID: ctx.get('userID'),
  });
});

type TestConfig = {
  isAuthRequired?: boolean;
};

async function setupTest(config: TestConfig = {}) {
  const app = new Hono();

  const authMiddleware = createAuthMiddleware({
    isAuthRequired: config.isAuthRequired,
    tokenVerifierConfig: {
      audience: 'test.com',
      issuer: 'https://test.com/',
      signingKey: TEST_SIGNING_KEY,
    },
  });

  app.use('/test', authMiddleware, testHandlerSpy);

  const signingKey = await jose.importPKCS8(TEST_SIGNING_KEY, 'RS256');

  const token = await createTestJWT({
    sub: TEST_TOKEN_PAYLOAD.sub,
    audience: 'test.com',
    issuer: 'https://test.com/',
    signingKey,
    alg: 'RS256',
  });

  return { app, token };
}

afterEach(() => {
  vi.restoreAllMocks();
});

test('it authorizes a valid token and extracts the payload and user ID', async () => {
  const { app, token } = await setupTest({ isAuthRequired: true });

  const req = new Request('http://localhost/test');

  req.headers.set('Authorization', `Bearer ${token}`);

  const res = await app.request(req);

  expect(testHandlerSpy).toHaveBeenCalled();

  expect(await res.json()).toMatchObject({
    payload: TEST_TOKEN_PAYLOAD,
    userID: TEST_TOKEN_PAYLOAD.sub,
  });

  expect(res.status).toBe(200);
});

test('it returns a 401 if no token is provided', async () => {
  const { app } = await setupTest({ isAuthRequired: true });

  const req = new Request('http://localhost/test');
  const res = await app.request(req);

  expect(testHandlerSpy).not.toHaveBeenCalled();
  expect(await res.text()).toBe('Unauthorized');
  expect(res.status).toBe(401);
});

test('it rejects an invalid authorization header', async () => {
  const { app } = await setupTest({ isAuthRequired: true });

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
  const { app } = await setupTest({ isAuthRequired: true });

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

test('it allows requests without auth header when auth is optional', async () => {
  const { app } = await setupTest({ isAuthRequired: false });

  const req = new Request('http://localhost/test');
  const res = await app.request(req);

  expect(testHandlerSpy).toHaveBeenCalled();
  expect(res.status).toBe(200);
});

test('it validates token when provided even if auth is optional', async () => {
  const { app } = await setupTest({ isAuthRequired: false });

  const req = new Request('http://localhost/test');

  req.headers.set('Authorization', 'Bearer invalid_token');

  const res = await app.request(req);

  expect(testHandlerSpy).not.toHaveBeenCalled();
  expect(await res.text()).toBe('Unauthorized');
  expect(res.status).toBe(401);
  expect(res.headers.get('www-authenticate')).toMatchInlineSnapshot(
    `"Bearer realm="http://localhost/test",error="invalid_token",error_description="token verification failure""`,
  );
});

test('it processes valid token when auth is optional', async () => {
  const { app, token } = await setupTest({ isAuthRequired: false });

  const req = new Request('http://localhost/test');

  req.headers.set('Authorization', `Bearer ${token}`);

  const res = await app.request(req);

  expect(testHandlerSpy).toHaveBeenCalled();
  expect(res.status).toBe(200);
  expect(await res.json()).toMatchObject({
    payload: TEST_TOKEN_PAYLOAD,
    userID: TEST_TOKEN_PAYLOAD.sub,
  });
});

test('it defaults to optional auth when isAuthRequired is not provided', async () => {
  const { app } = await setupTest();

  const req = new Request('http://localhost/test');
  const res = await app.request(req);

  expect(testHandlerSpy).toHaveBeenCalled();
  expect(res.status).toBe(200);
});
