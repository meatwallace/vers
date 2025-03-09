import {
  DeleteSessionRequest,
  DeleteSessionResponse,
} from '@vers/service-types';
import { SessionServiceContext } from './types';

export async function deleteSession(
  args: DeleteSessionRequest,
  ctx: SessionServiceContext,
): Promise<true> {
  const response = await ctx.client.post<DeleteSessionResponse>(
    'delete-session',
    {
      body: JSON.stringify(args),
      resolveBodyOnly: true,
    },
  );

  if (!response.success) {
    // TODO(#16): capture via Sentry
    throw new Error('An unknown error occurred');
  }

  return true;
}
