import { worlds } from '@chrononomicon/postgres-schema';
import { RawWorldData, UpdateWorldArgs, WorldServiceContext } from './types';
import { marshal } from './marshal';
import { ServiceResponse } from '../types';

type UpdateWorldResponse = ServiceResponse<RawWorldData>;

export async function updateWorld(
  args: UpdateWorldArgs,
  ctx: WorldServiceContext,
): Promise<typeof worlds.$inferSelect> {
  const response = await ctx.client.post<UpdateWorldResponse>('update-world', {
    body: JSON.stringify(args),
    resolveBodyOnly: true,
  });

  if (!response.success) {
    // TODO(#16): capture via Sentry
    throw new Error('An unknown error occurred');
  }

  return marshal(response.data);
}
