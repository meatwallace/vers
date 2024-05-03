import { users } from '@chrononomicon/postgres-schema';
import { ServiceResponse } from '../types';
import { GetCurrentUserArgs, RawUserData, userServiceContext } from './types';
import { marshal } from './marshal';

type GetCurrentUserResponse = ServiceResponse<RawUserData>;

export async function getCurrentUser(
  args: GetCurrentUserArgs,
  ctx: userServiceContext,
): Promise<typeof users.$inferSelect> {
  const response = await ctx.client.post<GetCurrentUserResponse>(
    'get-current-user',
    { resolveBodyOnly: true },
  );

  if (!response.success) {
    // TODO(#16): capture via Sentry
    throw new Error('An unknown error occurred');
  }

  return marshal(response.data);
}
