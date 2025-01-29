import * as jose from 'jose';
import invariant from 'tiny-invariant';

export type TokenVerifierConfig = {
  audience: string;
  issuer: string;
  signingKey: string;
};

type RelevantJWTPayload = {
  iss: string | undefined;
  sub: string;
};

export function createTokenVerifier(config: TokenVerifierConfig) {
  return async (token: string): Promise<RelevantJWTPayload> => {
    const publicKey = await jose.importPKCS8(config.signingKey, 'RS256');

    const { payload } = await jose.jwtVerify(token, publicKey, {
      issuer: config.issuer,
      audience: config.audience,
      algorithms: ['RS256'],
    });

    invariant(typeof payload.sub === 'string', 'sub must be in JWT payload');

    return {
      iss: payload.iss,
      sub: payload.sub,
    };
  };
}
