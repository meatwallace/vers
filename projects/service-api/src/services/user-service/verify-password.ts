import {
  VerifyPasswordRequest,
  VerifyPasswordResponse,
} from '@vers/service-types';
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

    return { error: response.error, success: false };
  }

  return { success: true };
}
