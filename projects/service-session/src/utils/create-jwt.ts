import * as jose from 'jose';
import { env } from '../env';

interface Data {
  expiresAt: Date;
  userID: string;
}

export async function createJWT(data: Data): Promise<string> {
  const pkcs8Key = await jose.importPKCS8(env.JWT_SIGNING_PRIVKEY, 'RS256');

  const jwt = await new jose.SignJWT({ sub: data.userID })
    .setProtectedHeader({ alg: 'RS256' })
    .setIssuedAt()
    .setIssuer(env.API_IDENTIFIER)
    .setAudience(env.API_IDENTIFIER)
    .setExpirationTime(data.expiresAt)
    .sign(pkcs8Key);

  return jwt;
}
