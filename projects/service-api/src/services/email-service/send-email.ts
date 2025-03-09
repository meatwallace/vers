import { SendEmailRequest } from '@vers/service-types';
import { ServiceResponse } from '@vers/service-types';
import { logger } from '~/logger';
import { EmailServiceContext } from './types';

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
