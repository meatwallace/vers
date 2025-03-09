import * as jose from 'jose';

interface TestTokenConfig {
  alg?: string;
  audience: string;
  issuer: string;
  signingKey?: jose.KeyLike | Uint8Array;
  sub: string;
}

export async function createTestJWT(config: TestTokenConfig): Promise<string> {
  const signingKey = config.signingKey ?? new TextEncoder().encode('secret');

  const jwt = await new jose.SignJWT({ sub: config.sub })
    .setProtectedHeader({ alg: config.alg ?? 'HS256' })
    .setIssuedAt()
    .setIssuer(config.issuer)
    .setAudience(config.audience)
    .setExpirationTime('1h')
    .sign(signingKey);

  return jwt;
}
