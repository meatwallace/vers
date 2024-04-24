import { serve } from '@hono/node-server';
import { app } from './app';

serve(app);

console.log('⚡️ Serving User API @ http://localhost:3000');
