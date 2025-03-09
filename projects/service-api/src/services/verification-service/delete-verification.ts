import {
  DeleteVerificationRequest,
  DeleteVerificationResponse,
} from '@vers/service-types';
import { VerificationServiceContext } from './types';

export async function deleteVerification(
  args: DeleteVerificationRequest,
  ctx: VerificationServiceContext,
): Promise<true> {
  const response = await ctx.client.post<DeleteVerificationResponse>(
    'delete-verification',
    {
      body: JSON.stringify(args),
      resolveBodyOnly: true,
    },
  );

  if (!response.success) {
    // TODO(#16): capture via Sentry
    throw new Error('An unknown error occurred');
  }

  return true;
}
