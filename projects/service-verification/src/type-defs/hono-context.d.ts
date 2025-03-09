import 'hono';

interface JWTPayload {
  iss: string | undefined;
  sub: string;
}

declare module 'hono' {
  interface ContextVariableMap {
    jwtPayload?: JWTPayload;
    token?: string;
  }
}
