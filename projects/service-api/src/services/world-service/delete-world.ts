import { ServiceResponse } from '../types';
import { GetWorldArgs, WorldServiceContext } from './types';
type DeleteWorldResponse = ServiceResponse<null>;

export async function deleteWorld(
  args: GetWorldArgs,
  ctx: WorldServiceContext,
): Promise<true> {
  const response = await ctx.client.post<DeleteWorldResponse>('delete-world', {
    body: JSON.stringify(args),
    resolveBodyOnly: true,
  });

  if (!response.success) {
    // TODO(#16): capture via Sentry
    throw new Error('An unknown error occurred');
  }

  return true;
}
