import {
  UpdateVerificationRequest,
  UpdateVerificationResponse,
} from '@chrono/service-types';
import { VerificationServiceContext } from './types';

export async function updateVerification(
  args: UpdateVerificationRequest,
  ctx: VerificationServiceContext,
): Promise<{ success: boolean }> {
  const response = await ctx.client.post<UpdateVerificationResponse>(
    'update-verification',
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
