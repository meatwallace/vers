import {
  CreateVerificationRequest,
  CreateVerificationResponse,
} from '@chrono/service-types';
import { marshal } from './marshal';
import { VerificationPayload, VerificationServiceContext } from './types';

export async function createVerification(
  args: CreateVerificationRequest,
  ctx: VerificationServiceContext,
): Promise<VerificationPayload> {
  const response = await ctx.client.post<CreateVerificationResponse>(
    'create-verification',
    {
      body: JSON.stringify(args),
      resolveBodyOnly: true,
    },
  );

  if (!response.success) {
    // TODO(#16): capture via Sentry
    throw new Error('An unknown error occurred');
  }

  const { otp, ...verification } = response.data;

  return {
    code: otp,
    verification: marshal(verification),
  };
}
