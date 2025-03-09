import { GetSessionRequest, GetSessionResponse } from '@chrono/service-types';
import { Jsonify } from 'type-fest';
import { marshal } from './marshal';
import { SessionData, SessionServiceContext } from './types';

export async function getSession(
  args: GetSessionRequest,
  ctx: SessionServiceContext,
): Promise<SessionData | null> {
  const response = await ctx.client.post<Jsonify<GetSessionResponse>>(
    `get-session`,
    {
      body: JSON.stringify(args),
      resolveBodyOnly: true,
    },
  );

  if (!response.success) {
    // TODO(#16): capture via Sentry
    throw new Error('An unknown error occurred');
  }

  return response.data ? marshal(response.data) : null;
}
