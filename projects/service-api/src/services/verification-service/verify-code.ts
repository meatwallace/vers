import { VerifyCodeRequest, VerifyCodeResponse } from '@chrono/service-types';
import { marshal } from './marshal';
import { VerificationData, VerificationServiceContext } from './types';

export async function verifyCode(
  args: VerifyCodeRequest,
  ctx: VerificationServiceContext,
): Promise<null | VerificationData> {
  const response = await ctx.client.post<VerifyCodeResponse>('verify-code', {
    body: JSON.stringify(args),
    resolveBodyOnly: true,
  });

  if (!response.success) {
    // TODO(#16): capture via Sentry
    console.error(response.error);

    return null;
  }

  return marshal(response.data);
}
