import { UpdateUserRequest, UpdateUserResponse } from '@chrono/service-types';
import { Jsonify } from 'type-fest';
import { UserServiceContext } from './types';

export async function updateUser(
  args: UpdateUserRequest,
  ctx: UserServiceContext,
): Promise<{ success: boolean }> {
  const response = await ctx.client.post<Jsonify<UpdateUserResponse>>(
    'update-user',
    {
      body: JSON.stringify(args),
      resolveBodyOnly: true,
    },
  );

  if (!response.success) {
    // TODO(#16): capture via Sentry
    throw new Error('An unknown error occurred');
  }

  return { success: true };
}
