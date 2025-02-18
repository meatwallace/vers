import {
  ChangePasswordRequest,
  ChangePasswordResponse,
} from '@chrono/service-types';
import { logger } from '~/logger';
import { UserServiceContext } from './types';

const log = logger.child({
  module: 'user-service.changePassword',
});

export async function changePassword(
  args: ChangePasswordRequest,
  ctx: UserServiceContext,
): Promise<true> {
  const response = await ctx.client.post<ChangePasswordResponse>(
    'change-password',
    {
      body: JSON.stringify(args),
      resolveBodyOnly: true,
    },
  );

  if (!response.success) {
    log.error(response);

    // TODO(#16): capture via Sentry
    throw new Error('An unknown error occurred');
  }

  return true;
}
