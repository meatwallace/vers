import 'hono';

declare module 'hono' {
  interface ContextVariableMap {
    token?: string;
    userID?: string;
    sessionID?: string;
    requestId: string;
    ipAddress: string;
  }
}
