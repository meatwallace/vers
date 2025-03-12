import 'hono';

declare module 'hono' {
  interface ContextVariableMap {
    cspNonce: string;
    ipAddress: string;
    requestId: string;
  }
}
