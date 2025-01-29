import { app } from './app';
import { createVerification } from './handlers/create-verification';
import { verifyCode } from './handlers/verify-code';
import { db } from './db';

app.post('/create-verification', async (ctx) => createVerification(ctx, db));

app.post('/verify-code', async (ctx) => verifyCode(ctx, db));
