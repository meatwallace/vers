import { worlds } from '@chrono/postgres-schema';
import { GetWorldsRequest, GetWorldsResponse } from '@chrono/service-types';
import { Jsonify } from 'type-fest';
import { marshal } from './marshal';
import { WorldServiceContext } from './types';

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
