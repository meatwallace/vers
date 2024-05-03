import { app } from './app';
import { getCurrentUser, getOrCreateUser } from './handlers';
import { db } from './db';
import { authMiddleware } from './middleware';

// include our auth middleware so we get jwt payload in the ctx to avoid calling
// the auth0 userinfo endpoint
app.post('/get-current-user', authMiddleware, async (ctx) =>
  getCurrentUser(ctx, db),
);

app.post('/get-or-create-user', async (ctx) => getOrCreateUser(ctx, db));
