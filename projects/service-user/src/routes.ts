import { app } from './app';
import { createUser } from './handlers/create-user';
import { getUser } from './handlers/get-user';
import { verifyPassword } from './handlers/verify-password';
import { db } from './db';

app.post('/create-user', async (ctx) => createUser(ctx, db));
app.post('/get-user', async (ctx) => getUser(ctx, db));
app.post('/verify-password', async (ctx) => verifyPassword(ctx, db));
