interface MockJWTPayload {
  sub: string;
  exp: number;
}

/**
 * Decodes a mock JWT from Base64
 * @param token - The token to decode
 * @returns The decoded JWT
 */
export function decodeMockJWT(token: string): MockJWTPayload {
  const payload = JSON.parse(atob(token.split('.')[1])) as MockJWTPayload;

  return {
    sub: payload.sub,
    exp: payload.exp,
  };
}
