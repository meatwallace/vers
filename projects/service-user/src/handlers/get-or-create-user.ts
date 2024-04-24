import { eq } from 'drizzle-orm';
import { Context } from 'hono';
import * as schema from '@campaign/postgres-schema';
import {
  getTokenFromContext,
  getUserFromContext,
} from '@campaign/service-utils';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as auth0 from '../auth0';

export async function getOrCreateUser(
  ctx: Context,
  db: PostgresJsDatabase<typeof schema>,
) {
  const user = getUserFromContext(ctx);

  const existingUser = await db.query.users.findFirst({
    where: eq(schema.users.id, user.id),
  });

  if (existingUser) {
    return ctx.json({ success: true, data: existingUser });
  }

  const accessToken = getTokenFromContext(ctx);
  const auth0UserInfo = await auth0.userInfoClient.getUserInfo(accessToken);

  const newUser = {
    id: user.id,
    email: auth0UserInfo.data.email,
    emailVerified: auth0UserInfo.data.email_verified,
    name: auth0UserInfo.data.name,
    createdAt: new Date(),
  };

  await db.insert(schema.users).values(newUser);

  return ctx.json({ success: true, data: newUser });
}
