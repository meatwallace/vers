interface MockJWTPayload {
  exp: number;
  sub: string;
}

/**
 * Decodes a mock JWT from Base64
 * @param token - The token to decode
 * @returns The decoded JWT
 */
export function decodeMockJWT(token: string): MockJWTPayload {
  const [, payload] = token.split('.');

  if (!payload) {
    throw new Error('Invalid token');
  }

  const decoded = JSON.parse(atob(payload)) as MockJWTPayload;

  return {
    exp: decoded.exp,
    sub: decoded.sub,
  };
}
