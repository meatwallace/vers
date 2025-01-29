import { CreateUserRequest, CreateUserResponse } from '@chrono/service-types';
import { Jsonify } from 'type-fest';
import { marshal } from './marshal';
import { UserData, UserServiceContext } from './types';

export async function createUser(
  args: CreateUserRequest,
  ctx: UserServiceContext,
): Promise<UserData> {
  const response = await ctx.client.post<Jsonify<CreateUserResponse>>(
    'create-user',
    {
      body: JSON.stringify(args),
      resolveBodyOnly: true,
    },
  );

  if (!response.success) {
    // TODO(#16): capture via Sentry
    throw new Error('An unknown error occurred');
  }

  return marshal(response.data);
}
