import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';

type User = {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string;
};

export function getUserFromContext(ctx: Context): User {
  const tokenPayload = ctx.get('jwtPayload');

  if (!tokenPayload) {
    throw new HTTPException(401, { message: 'Unauthorized' });
  }

  return {
    id: tokenPayload.sub, // TODO: what does this look like? can we pull a clean user ID?
    email: tokenPayload.email,
    emailVerified: tokenPayload.email_verified === 'true',
    name: tokenPayload.name,
  };
}
