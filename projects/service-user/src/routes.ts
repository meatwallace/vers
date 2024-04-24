import { app } from './app';
import { getOrCreateUser } from './handlers';
import { db } from './db';
import { authMiddleware } from './middleware';

app.get('/get-or-create-user', authMiddleware, async (ctx) =>
  getOrCreateUser(ctx, db),
);
