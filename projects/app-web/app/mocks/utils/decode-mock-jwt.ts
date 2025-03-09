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
  const payload = JSON.parse(atob(token.split('.')[1])) as MockJWTPayload;

  return {
    exp: payload.exp,
    sub: payload.sub,
  };
}
