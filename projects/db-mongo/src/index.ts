import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { timeout } from 'hono/timeout';
import { env } from './env';
import { handleRoleCheck } from './handle-role-check';
import { handleVMCheck } from './handle-vm-check';

const app = new Hono();

app.get('/flycheck/vm', timeout(5000), handleVMCheck);
app.get('/flycheck/role', timeout(5000), handleRoleCheck);

serve({ fetch: app.fetch, hostname: env.HOSTNAME, port: env.PORT });
