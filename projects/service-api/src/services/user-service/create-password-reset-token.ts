import {
  CreatePasswordResetTokenRequest,
  CreatePasswordResetTokenResponse,
} from '@chrono/service-types';
import { logger } from '~/logger';
import { UserServiceContext } from './types';

const log = logger.child({
  module: 'user-service.createPasswordResetToken',
});

export async function createPasswordResetToken(
  args: CreatePasswordResetTokenRequest,
  ctx: UserServiceContext,
): Promise<string> {
  const response = await ctx.client.post<CreatePasswordResetTokenResponse>(
    'create-password-reset-token',
    {
      body: JSON.stringify(args),
      resolveBodyOnly: true,
    },
  );

  if (!response.success) {
    // TODO(#16): capture via Sentry
    log.error(response);

    throw new Error('An unknown error occurred');
  }

  return response.data.resetToken;
}
