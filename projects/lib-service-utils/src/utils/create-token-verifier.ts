import jwt, {
  Jwt,
  JwtHeader,
  JwtPayload,
  SigningKeyCallback,
  VerifyOptions,
} from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

type Result = string | Jwt | JwtPayload;

export type TokenVerifierConfig = {
  audience: string;
  issuer: string;
};

export function createTokenVerifier(config: TokenVerifierConfig) {
  // wrap jwt#verify in a promise to avoid callback hell
  const verifyJWT = (token: string, options: VerifyOptions): Promise<Result> =>
    new Promise((resolve, reject) => {
      jwt.verify(token, getKey, options, (error, decoded) => {
        if (error) {
          return reject(error);
        }

        if (decoded) {
          return resolve(decoded);
        }
      });
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

  return async (token: string): Promise<Result> => {
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
