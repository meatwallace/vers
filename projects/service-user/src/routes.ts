import { app } from './app';
import { getCurrentUser, getOrCreateUser } from './handlers';
import { db } from './db';
import { authMiddleware } from './middleware';

app.post('/get-current-user', authMiddleware, async (ctx) =>
  getCurrentUser(ctx, db),
);

app.post('/get-or-create-user', authMiddleware, async (ctx) =>
  getOrCreateUser(ctx, db),
);
