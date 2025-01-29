import { SendEmailRequest } from '@chrono/service-types';
import { ServiceResponse } from '@chrono/service-types';
import { EmailServiceContext } from './types';
import { logger } from '~/logger';

type SendEmailResponse = ServiceResponse<void>;

export async function sendEmail(
  args: SendEmailRequest,
  ctx: EmailServiceContext,
): Promise<void> {
  const response = await ctx.client.post<SendEmailResponse>('send-email', {
    body: JSON.stringify(args),
    resolveBodyOnly: true,
  });

  if (!response.success) {
    logger.error(response.error);

    // TODO(#16): capture via Sentry
    throw new Error('An unknown error occurred');
  }
}
