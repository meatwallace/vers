import 'hono';

declare module 'hono' {
  type ContextVariableMap = Record<string, never>;
}
