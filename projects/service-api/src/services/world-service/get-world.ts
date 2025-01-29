import { Jsonify } from 'type-fest';
import { GetWorldRequest, GetWorldResponse } from '@chrono/service-types';
import { WorldServiceContext, WorldData } from './types';
import { marshal } from './marshal';

export async function getWorld(
  args: GetWorldRequest,
  ctx: WorldServiceContext,
): Promise<WorldData | null> {
  const response = await ctx.client.post<Jsonify<GetWorldResponse>>(
    'get-world',
    {
      body: JSON.stringify(args),
      resolveBodyOnly: true,
    },
  );

  if (!response.success) {
    // TODO(#16): capture via Sentry
    throw new Error('An unknown error occurred');
  }

  if (!response.data) {
    return null;
  }

  return marshal(response.data);
}
