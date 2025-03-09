import {
  RefreshTokensRequest,
  RefreshTokensResponse,
} from '@vers/service-types';
import { Jsonify } from 'type-fest';
import { marshal } from './marshal';
import { AuthPayload, SessionServiceContext } from './types';

export async function refreshTokens(
  args: RefreshTokensRequest,
  ctx: SessionServiceContext,
): Promise<AuthPayload> {
  const response = await ctx.client.post<Jsonify<RefreshTokensResponse>>(
    'refresh-tokens',
    {
      body: JSON.stringify(args),
      resolveBodyOnly: true,
    },
  );

  if (!response.success) {
    // TODO(#16): capture via Sentry
    throw new Error('An unknown error occurred');
  }

  const { accessToken, refreshToken, ...session } = response.data;

  return {
    accessToken,
    refreshToken,
    session: marshal(session),
  };
}
