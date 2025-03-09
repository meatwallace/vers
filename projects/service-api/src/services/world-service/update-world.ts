import { worlds } from '@chrono/postgres-schema';
import { UpdateWorldRequest, UpdateWorldResponse } from '@chrono/service-types';
import { Jsonify } from 'type-fest';
import { marshal } from './marshal';
import { WorldServiceContext } from './types';

export async function updateWorld(
  args: UpdateWorldRequest,
  ctx: WorldServiceContext,
): Promise<typeof worlds.$inferSelect> {
  const response = await ctx.client.post<Jsonify<UpdateWorldResponse>>(
    'update-world',
    {
      body: JSON.stringify(args),
      resolveBodyOnly: true,
    },
  );

  if (!response.success) {
    // TODO(#16): capture via Sentry
    throw new Error('An unknown error occurred');
  }

  return marshal(response.data);
}
