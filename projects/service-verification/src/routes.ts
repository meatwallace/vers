import { app } from './app';
import { createVerification } from './handlers/create-verification';
import { deleteVerification } from './handlers/delete-verification';
import { getVerification } from './handlers/get-verification';
import { updateVerification } from './handlers/update-verification';
import { verifyCode } from './handlers/verify-code';
import { get2FAVerificationURI } from './handlers/get-2fa-verification-uri';
import { db } from './db';

app.post('/create-verification', async (ctx) => createVerification(ctx, db));

app.post('/delete-verification', async (ctx) => deleteVerification(ctx, db));

app.post('/get-verification', async (ctx) => getVerification(ctx, db));

app.post('/update-verification', async (ctx) => updateVerification(ctx, db));

app.post('/verify-code', async (ctx) => verifyCode(ctx, db));

app.post('/get-2fa-verification-uri', async (ctx) =>
  get2FAVerificationURI(ctx, db),
);
