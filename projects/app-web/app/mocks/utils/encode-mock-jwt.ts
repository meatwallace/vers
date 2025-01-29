type MockJWTPayload = {
  sub: string;
  exp: number;
};

export function encodeMockJWT(payload: MockJWTPayload): string {
  const header = {
    typ: 'JWT',
    alg: 'HS256',
  };

  const encodedHeader = btoa(JSON.stringify(header));

  return `${encodedHeader}.${btoa(JSON.stringify(payload))}`;
}
