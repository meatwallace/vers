import { eq } from 'drizzle-orm';
import { Context } from 'hono';
import { createId } from '@paralleldrive/cuid2';
import * as schema from '@chrononomicon/postgres-schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as auth0 from '../auth0';
import { HTTPException } from 'hono/http-exception';
import { getTokenFromHeader } from '@chrononomicon/service-utils';

type RequestBody = {
  email: string;
};

export async function getOrCreateUser(
  ctx: Context,
  db: PostgresJsDatabase<typeof schema>,
) {
  try {
    const { email } = await ctx.req.json<RequestBody>();

    const existingUser = await db.query.users.findFirst({
      where: eq(schema.users.email, email),
    });

    if (existingUser) {
      return ctx.json({ success: true, data: existingUser });
    }

    const authHeader = ctx.req.header('authorization');
    const accessToken = getTokenFromHeader(authHeader);

    if (!accessToken) {
      throw new HTTPException(401, { message: 'Unauthorized' });
    }

    const auth0UserInfo = await auth0.userInfoClient.getUserInfo(accessToken);

    const newUser = {
      id: createId(),
      auth0ID: auth0UserInfo.data.sub,
      email: auth0UserInfo.data.email,
      emailVerified: auth0UserInfo.data.email_verified,
      name: auth0UserInfo.data.name,
      firstName: auth0UserInfo.data.given_name,
      createdAt: new Date(),
    };

    await db.insert(schema.users).values(newUser);

    return ctx.json({ success: true, data: newUser });
  } catch (error: unknown) {
    // TODO(#16): capture via Sentry
    if (error instanceof Error) {
      return ctx.json({ success: false, error: 'An unknown error occurred' });
    }

    throw error;
  }
}
