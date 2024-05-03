import { worlds } from '@chrononomicon/postgres-schema';
import { ServiceResponse } from '../types';
import { GetWorldArgs, RawWorldData, WorldServiceContext } from './types';
import { marshal } from './marshal';

type GetWorldResponse = ServiceResponse<RawWorldData>;

export async function getWorld(
  args: GetWorldArgs,
  ctx: WorldServiceContext,
): Promise<typeof worlds.$inferSelect> {
  const response = await ctx.client.post<GetWorldResponse>('get-world', {
    body: JSON.stringify(args),
    resolveBodyOnly: true,
  });

  if (!response.success) {
    // TODO(#16): capture via Sentry
    throw new Error('An unknown error occurred');
  }

  return marshal(response.data);
}
