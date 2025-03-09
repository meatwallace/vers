import { GetUserRequest, GetUserResponse } from '@vers/service-types';
import { Jsonify } from 'type-fest';
import { marshal } from './marshal';
import { UserData, UserServiceContext } from './types';

export async function getUser(
  args: GetUserRequest,
  ctx: UserServiceContext,
): Promise<null | UserData> {
  const response = await ctx.client.post<Jsonify<GetUserResponse>>('get-user', {
    body: JSON.stringify(args),
    resolveBodyOnly: true,
  });

  if (!response.success) {
    // TODO(#16): capture via Sentry
    throw new Error('An unknown error occurred');
  }

  if (!response.data) {
    return null;
  }

  return marshal(response.data);
}
