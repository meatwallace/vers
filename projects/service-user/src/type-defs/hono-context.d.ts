import 'hono';

type JWTPayload = {
  iss: string | undefined;
  sub: string;
};

declare module 'hono' {
  interface ContextVariableMap {
    token?: string;
    jwtPayload?: JWTPayload;
  }
}
