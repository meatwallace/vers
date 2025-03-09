import { SendEmailRequest, SendEmailResponse } from '@chrono/service-types';
import { Context } from 'hono';
import { Resend } from 'resend';
import { env } from '../env';
import { logger } from '../logger';

const resend = new Resend(env.RESEND_API_KEY);

const log = logger.child({ module: 'sendEmail' });

export async function sendEmail(ctx: Context) {
  try {
    const { html, plainText, subject, to } =
      await ctx.req.json<SendEmailRequest>();

    const result = await resend.emails.send({
      from: 'noreply@transactional.chrononomicon.com',
      html,
      subject,
      text: plainText,
      to,
    });

    if (result.error) {
      log.error('failed to send email with resend:');
      log.error({ error: result.error });

      // TODO(#16): capture via Sentry
      return ctx.json({ error: 'Failed to send email', success: false });
    }

    const response: SendEmailResponse = {
      data: {},
      success: true,
    };

    return ctx.json(response);
  } catch (error: unknown) {
    log.error('unknown error');
    log.error(error);

    // TODO(#16): capture via Sentry
    if (error instanceof Error) {
      const response = {
        error: 'An unknown error occurred',
        success: false,
      };

      return ctx.json(response);
    }

    throw error;
  }
}
