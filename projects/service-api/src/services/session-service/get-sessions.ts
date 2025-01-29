import { GetSessionsRequest, GetSessionsResponse } from '@chrono/service-types';
import { Jsonify } from 'type-fest';
import { marshal } from './marshal';
import { SessionData, SessionServiceContext } from './types';

export async function getSessions(
  args: GetSessionsRequest,
  ctx: SessionServiceContext,
): Promise<Array<SessionData>> {
  const response = await ctx.client.post<Jsonify<GetSessionsResponse>>(
    `get-sessions`,
    {
      body: JSON.stringify(args),
      resolveBodyOnly: true,
    },
  );

  if (!response.success) {
    // TODO(#16): capture via Sentry
    throw new Error('An unknown error occurred');
  }

  return response.data.map((session) => marshal(session));
}
