import {
  GetVerificationRequest,
  GetVerificationResponse,
} from '@chrono/service-types';
import { VerificationData, VerificationServiceContext } from './types';
import { marshal } from './marshal';

export async function getVerification(
  args: GetVerificationRequest,
  ctx: VerificationServiceContext,
): Promise<VerificationData | null> {
  const response = await ctx.client.post<GetVerificationResponse>(
    'get-verification',
    {
      body: JSON.stringify(args),
      resolveBodyOnly: true,
    },
  );

  if (!response.success) {
    // TODO(#16): capture via Sentry
    // console.error(response.error);

    return null;
  }

  return response.data ? marshal(response.data) : null;
}
