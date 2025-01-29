import { Resend } from 'resend';
import { Context } from 'hono';
import { SendEmailRequest, SendEmailResponse } from '@chrono/service-types';
import { env } from '../env';
import { logger } from '../logger';

const resend = new Resend(env.RESEND_API_KEY);

const log = logger.child({ module: 'sendEmail' });

export async function sendEmail(ctx: Context) {
  try {
    const { to, subject, html, plainText } =
      await ctx.req.json<SendEmailRequest>();

    const result = await resend.emails.send({
      from: 'noreply@transactional.chrononomicon.com',
      to,
      subject,
      html,
      text: plainText,
    });

    if (result.error) {
      log.error('failed to send email with resend:');
      log.error({ error: result.error });

      // TODO(#16): capture via Sentry
      return ctx.json({ success: false, error: 'Failed to send email' });
    }

    const response: SendEmailResponse = {
      success: true,
      data: {},
    };

    return ctx.json(response);
  } catch (error: unknown) {
    log.error('unknown error');
    log.error(error);

    // TODO(#16): capture via Sentry
    if (error instanceof Error) {
      const response = {
        success: false,
        error: 'An unknown error occurred',
      };

      return ctx.json(response);
    }

    throw error;
  }
}
