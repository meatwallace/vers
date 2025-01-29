type MockJWTPayload = {
  sub: string;
  exp: number;
};

export function decodeMockJWT(token: string): MockJWTPayload {
  const payload = JSON.parse(atob(token.split('.')[1]));

  return {
    sub: payload.sub,
    exp: payload.exp,
  };
}
