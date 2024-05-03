import createJWKSMock from 'mock-jwks';

type TestTokenConfig = {
  jwks: ReturnType<typeof createJWKSMock>;
  audience: string;
  issuer: string;
};

type AuthedTestUtils = {
  accessToken: string;
};

export function createTestAccessToken(
  config: TestTokenConfig,
): AuthedTestUtils {
  const accessToken = config.jwks.token({
    sub: 'auth0|test_id',
    iss: config.issuer,
    aud: config.audience,
  });

  return { accessToken };
}
