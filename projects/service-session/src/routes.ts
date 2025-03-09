import { app } from './app';
import { db } from './db';
import { createSession } from './handlers/create-session';
import { deleteSession } from './handlers/delete-session';
import { getSession } from './handlers/get-session';
import { getSessions } from './handlers/get-sessions';
import { refreshTokens } from './handlers/refresh-tokens';

app.post('/create-session', async (ctx) => createSession(ctx, db));

app.post('/delete-session', async (ctx) => deleteSession(ctx, db));

app.post('/get-session', async (ctx) => getSession(ctx, db));

app.post('/get-sessions', async (ctx) => getSessions(ctx, db));

app.post('/refresh-tokens', async (ctx) => refreshTokens(ctx, db));
