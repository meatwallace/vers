import { GetWorldRequest, GetWorldResponse } from '@chrono/service-types';
import { Jsonify } from 'type-fest';
import { marshal } from './marshal';
import { WorldData, WorldServiceContext } from './types';

export async function getWorld(
  args: GetWorldRequest,
  ctx: WorldServiceContext,
): Promise<null | WorldData> {
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
