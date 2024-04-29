import { serve } from '@hono/node-server';
import { app } from './app';
import './routes';

serve({ fetch: app.fetch, port: 3001 });

console.log('⚡️ Serving User API @ http://localhost:3001');
