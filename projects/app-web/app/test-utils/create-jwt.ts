import * as jose from 'jose';

type JWTConfig = {
  sub: string;
  issuer: string;
  audience: string;
  expirationTime?: string;
  alg?: string;
};

export async function createJWT(config: JWTConfig): Promise<string> {
  const signingKey = new TextEncoder().encode('secret');

  const jwt = await new jose.SignJWT({ sub: config.sub })
    .setProtectedHeader({ alg: config.alg ?? 'HS256' })
    .setIssuedAt()
    .setIssuer(config.issuer)
    .setAudience(config.audience)
    .setExpirationTime(config.expirationTime ?? '1h')
    .sign(signingKey);

  return jwt;
}
