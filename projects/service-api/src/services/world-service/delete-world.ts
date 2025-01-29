import { DeleteWorldRequest, DeleteWorldResponse } from '@chrono/service-types';
import { WorldServiceContext } from './types';

export async function deleteWorld(
  args: DeleteWorldRequest,
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
