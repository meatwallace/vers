import {
  VerifyPasswordRequest,
  VerifyPasswordResponse,
} from '@chrono/service-types';
import { UserServiceContext, VerifyPasswordPayload } from './types';

export async function verifyPassword(
  args: VerifyPasswordRequest,
  ctx: UserServiceContext,
): Promise<VerifyPasswordPayload> {
  const response = await ctx.client.post<VerifyPasswordResponse>(
    'verify-password',
    {
      body: JSON.stringify(args),
      resolveBodyOnly: true,
    },
  );

  if (!response.success) {
    // TODO(#16): capture via Sentry
    console.error(response.error);

    return { success: false, error: response.error };
  }

  return { success: true };
}
