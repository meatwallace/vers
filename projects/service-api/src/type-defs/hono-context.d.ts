import 'hono';

declare module 'hono' {
  interface ContextVariableMap {
    ipAddress: string;
    requestId: string;
    sessionID?: string;
    token?: string;
    userID?: string;
  }
}
