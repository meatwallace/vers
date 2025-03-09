import {
  Get2FAVerificationURIRequest,
  Get2FAVerificationURIResponse,
} from '@vers/service-types';
import { VerificationServiceContext } from './types';

export async function get2FAVerificationURI(
  args: Get2FAVerificationURIRequest,
  ctx: VerificationServiceContext,
): Promise<string> {
  const response = await ctx.client.post<Get2FAVerificationURIResponse>(
    'get-2fa-verification-uri',
    {
      body: JSON.stringify(args),
      resolveBodyOnly: true,
    },
  );

  if (!response.success) {
    // TODO(#16): capture via Sentry
    throw new Error('An unknown error occurred');
  }

  return response.data.otpURI;
}
