import 'hono';

interface JWTPayload {
  iss: string | undefined;
  sub: string;
}

declare module 'hono' {
  interface ContextVariableMap {
    token?: string;
    jwtPayload?: JWTPayload;
  }
}
