import { app } from './app';
import { createSession } from './handlers/create-session';
import { deleteSession } from './handlers/delete-session';
import { refreshTokens } from './handlers/refresh-tokens';
import { db } from './db';

app.post('/create-session', async (ctx) => createSession(ctx, db));
app.post('/delete-session', async (ctx) => deleteSession(ctx, db));
app.post('/refresh-tokens', async (ctx) => refreshTokens(ctx, db));
