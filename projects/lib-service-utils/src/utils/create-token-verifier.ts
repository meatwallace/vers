import jwt, {
  JwtHeader,
  JwtPayload,
  SigningKeyCallback,
  VerifyOptions,
} from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

export type TokenVerifierConfig = {
  audience: string;
  issuer: string;
};

type RelevantJWTPayload = {
  iss: string | undefined;
  sub: string;
};

export function createTokenVerifier(config: TokenVerifierConfig) {
  // wrap jwt#verify in a promise to avoid callback hell
  const verifyJWT = (
    token: string,
    options: VerifyOptions,
  ): Promise<RelevantJWTPayload> =>
    new Promise((resolve, reject) => {
      jwt.verify(
        token,
        getKey,
        options,
        (error, decoded: JwtPayload | string | undefined) => {
          if (error) {
            return reject(error);
          }

          if (typeof decoded === 'string' || !decoded || !decoded.sub) {
            return reject(new Error('Invalid token'));
          }

          return resolve({
            iss: decoded.iss,
            sub: decoded.sub,
          });
        },
      );
    });

  const client = jwksClient({
    jwksUri: `${config.issuer}.well-known/jwks.json`,
  });

  function getKey(header: JwtHeader, callback: SigningKeyCallback) {
    client.getSigningKey(header.kid, function (_, key) {
      const signingKey = key?.getPublicKey();

      callback(null, signingKey);
    });
  }

  return async (token: string): Promise<RelevantJWTPayload> => {
    if (!token) {
      throw new Error('No token provided');
    }

    const result = await verifyJWT(token, {
      audience: config.audience,
      issuer: config.issuer,
      algorithms: ['RS256'],
    });

    return result;
  };
}
