import { users } from '@campaign/postgres-schema';
import {
  GetOrCreateUserArgs,
  RawUserData,
  ServiceResponse,
  userServiceContext,
} from './types';
import { marshal } from './marshal';

type GetOrCreateUserResponse = ServiceResponse<RawUserData>;

export async function getOrCreateUser(
  args: GetOrCreateUserArgs,
  ctx: userServiceContext,
): Promise<typeof users.$inferSelect> {
  const response = await ctx.client.post<GetOrCreateUserResponse>(
    'get-or-create-user',
    { body: JSON.stringify(args), resolveBodyOnly: true },
  );

  if (!response.success) {
    // TODO(#16): capture via Sentry
    throw new Error('An unknown error occurred');
  }

  return marshal(response.data);
}
