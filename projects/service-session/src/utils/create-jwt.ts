import * as jose from 'jose';
import { env } from '../env';

type Data = {
  userID: string;
  expiresAt: Date;
};

export async function createJWT(data: Data): Promise<string> {
  const alg = 'RS256';
  const privateKey = await jose.importPKCS8(env.JWT_SIGNING_SECRET, alg);

  const jwt = await new jose.SignJWT({ sub: data.userID })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setIssuer(env.API_IDENTIFIER)
    .setAudience(env.API_IDENTIFIER)
    .setExpirationTime(data.expiresAt)
    .sign(privateKey);

  return jwt;
}
