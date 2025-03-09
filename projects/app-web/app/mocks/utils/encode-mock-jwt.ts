interface MockJWTPayload {
  sub: string;
  exp: number;
}

/**
 * Encodes a mock JWT in Base64
 * @param payload - The payload to encode
 * @returns The encoded JWT
 */
export function encodeMockJWT(payload: MockJWTPayload): string {
  const header = {
    typ: 'JWT',
    alg: 'HS256',
  };

  const encodedHeader = btoa(JSON.stringify(header));

  return `${encodedHeader}.${btoa(JSON.stringify(payload))}`;
}
