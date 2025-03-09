import * as jose from 'jose';
import invariant from 'tiny-invariant';

export interface TokenVerifierConfig {
  audience: string;
  issuer: string;
  signingKey: string;
}

interface RelevantJWTPayload {
  iss: string | undefined;
  sub: string;
}

export function createTokenVerifier(config: TokenVerifierConfig) {
  return async (token: string): Promise<RelevantJWTPayload> => {
    const publicKey = await jose.importPKCS8(config.signingKey, 'RS256');

    const { payload } = await jose.jwtVerify(token, publicKey, {
      algorithms: ['RS256'],
      audience: config.audience,
      issuer: config.issuer,
    });

    invariant(typeof payload.sub === 'string', 'sub must be in JWT payload');

    return {
      iss: payload.iss,
      sub: payload.sub,
    };
  };
}
