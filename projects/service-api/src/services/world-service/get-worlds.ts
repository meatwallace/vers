import { Jsonify } from 'type-fest';
import { worlds } from '@chrono/postgres-schema';
import { GetWorldsRequest, GetWorldsResponse } from '@chrono/service-types';
import { WorldServiceContext } from './types';
import { marshal } from './marshal';

export async function getWorlds(
  args: GetWorldsRequest,
  ctx: WorldServiceContext,
): Promise<Array<typeof worlds.$inferSelect>> {
  const response = await ctx.client.post<Jsonify<GetWorldsResponse>>(
    'get-worlds',
    {
      body: JSON.stringify(args),
      resolveBodyOnly: true,
    },
  );

  if (!response.success) {
    // TODO(#16): capture via Sentry
    throw new Error('An unknown error occurred');
  }

  return response.data.map((rawWorld) => marshal(rawWorld));
}
