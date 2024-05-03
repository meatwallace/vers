import { app } from './app';
import { db } from './db';
import * as handlers from './handlers';

app.post('/create-world', async (ctx) => handlers.createWorld(ctx, db));

app.post('/get-world', async (ctx) => handlers.getWorld(ctx, db));

app.post('/get-worlds', async (ctx) => handlers.getWorlds(ctx, db));

app.post('/update-world', async (ctx) => handlers.updateWorld(ctx, db));

app.post('/delete-world', async (ctx) => handlers.deleteWorld(ctx, db));

app.post('/generate-world-names', async (ctx) =>
  handlers.generateWorldNames(ctx, db),
);
