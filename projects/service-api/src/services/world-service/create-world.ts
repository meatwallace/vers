import { worlds } from '@chrono/postgres-schema';
import { CreateWorldRequest, CreateWorldResponse } from '@chrono/service-types';
import { Jsonify } from 'type-fest';
import { marshal } from './marshal';
import { WorldServiceContext } from './types';

export async function createWorld(
  args: CreateWorldRequest,
  ctx: WorldServiceContext,
): Promise<typeof worlds.$inferSelect> {
  const response = await ctx.client.post<Jsonify<CreateWorldResponse>>(
    'create-world',
    {
      body: JSON.stringify(args),
      resolveBodyOnly: true,
    },
  );

  if (!response.success) {
    // TODO(#16): capture via Sentry
    throw new Error('An unknown error occurred');
  }

  // @ts-expect-error(#37): marshal with zod for nice types
  return marshal(response.data);
}
