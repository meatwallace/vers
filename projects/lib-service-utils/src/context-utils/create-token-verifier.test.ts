import createJWKSMock from 'mock-jwks';
import { createTokenVerifier } from './create-token-verifier';

const TEST_TOKEN_PAYLOAD = {
  sub: 'test_id',
  iss: `https://test.com/`,
};

const jwks = createJWKSMock(`https://test.com/`);

const verifyToken = createTokenVerifier({
  audience: '',
  issuer: 'https://test.com/',
});

function setupTest() {
  jwks.start();
}

afterEach(() => {
  jwks.stop();
  vi.restoreAllMocks();
});

test('it authorizes a valid token and extracts the payload', async () => {
  setupTest();

  const token = jwks.token(TEST_TOKEN_PAYLOAD);

  const payload = await verifyToken(token);

  expect(payload).toMatchObject(TEST_TOKEN_PAYLOAD);
});

test('should return a 401 if no token is provided', async () => {
  setupTest();

  await expect(verifyToken('')).rejects.toThrowError('No token provided');
});

test('should return a 401 an invalid token', async () => {
  setupTest();

  await expect(verifyToken('abc123')).rejects.toThrowError('jwt malformed');
});
