import { worlds } from '@chrononomicon/postgres-schema';
import { ServiceResponse } from '../types';
import { GetWorldsArgs, RawWorldData, WorldServiceContext } from './types';
import { marshal } from './marshal';

type GetWorldsResponse = ServiceResponse<Array<RawWorldData>>;

export async function getWorlds(
  args: GetWorldsArgs,
  ctx: WorldServiceContext,
): Promise<Array<typeof worlds.$inferSelect>> {
  const response = await ctx.client.post<GetWorldsResponse>('get-worlds', {
    body: JSON.stringify(args),
    resolveBodyOnly: true,
  });

  if (!response.success) {
    // TODO(#16): capture via Sentry
    throw new Error('An unknown error occurred');
  }

  return response.data.map((rawWorld: RawWorldData) => marshal(rawWorld));
}
