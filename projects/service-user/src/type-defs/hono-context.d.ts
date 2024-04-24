import 'hono';

// TODO: clean up this type
type JWTPayload = {
  sub: string;
  email: string;
  email_verified: string;
  name: string;
};

declare module 'hono' {
  interface ContextVariableMap {
    token?: string;
    jwtPayload?: JWTPayload;
  }
}
