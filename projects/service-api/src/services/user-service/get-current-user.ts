import { users } from '@campaign/postgres-schema';
import {
  GetCurrentUserArgs,
  RawUserData,
  ServiceResponse,
  userServiceContext,
} from './types';
import { marshal } from './marshal';

type GetCurrentUserResponse = ServiceResponse<RawUserData>;

export async function getCurrentUser(
  args: GetCurrentUserArgs,
  ctx: userServiceContext,
): Promise<typeof users.$inferSelect> {
  const response = await ctx.client.get<GetCurrentUserResponse>(
    'get-current-user',
    { resolveBodyOnly: true },
  );

  if (!response.success) {
    // TODO(#16): capture via Sentry
    throw new Error('An unknown error occurred');
  }

  return marshal(response.data);
}
