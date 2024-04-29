import 'hono';

type JWTPayload = {
  sub: string;
};

declare module 'hono' {
  interface ContextVariableMap {
    token?: string;
    jwtPayload?: JWTPayload;
  }
}
