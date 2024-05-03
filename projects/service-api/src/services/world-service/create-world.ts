import { worlds } from '@chrononomicon/postgres-schema';
import { ServiceResponse } from '../types';
import { CreateWorldArgs, RawWorldData, WorldServiceContext } from './types';
import { marshal } from './marshal';

type CreateWorldResponse = ServiceResponse<RawWorldData>;

export async function createWorld(
  args: CreateWorldArgs,
  ctx: WorldServiceContext,
): Promise<typeof worlds.$inferSelect> {
  const response = await ctx.client.post<CreateWorldResponse>('create-world', {
    body: JSON.stringify(args),
    resolveBodyOnly: true,
  });

  if (!response.success) {
    // TODO(#16): capture via Sentry
    throw new Error('An unknown error occurred');
  }

  return marshal(response.data);
}
