import 'hono';

declare module 'hono' {
  interface ContextVariableMap {
    token?: string;
    userID?: string;
    requestId: string;
    ipAddress: string;
  }
}
