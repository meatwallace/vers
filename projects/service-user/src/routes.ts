import { app } from './app';
import { changePassword } from './handlers/change-password';
import { createPasswordResetToken } from './handlers/create-password-reset-token';
import { createUser } from './handlers/create-user';
import { getUser } from './handlers/get-user';
import { verifyPassword } from './handlers/verify-password';
import { db } from './db';

app.post('/change-password', async (ctx) => changePassword(ctx, db));

app.post('/create-password-reset-token', async (ctx) =>
  createPasswordResetToken(ctx, db),
);

app.post('/create-user', async (ctx) => createUser(ctx, db));

app.post('/get-user', async (ctx) => getUser(ctx, db));

app.post('/verify-password', async (ctx) => verifyPassword(ctx, db));
