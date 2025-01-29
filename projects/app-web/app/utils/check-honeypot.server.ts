import { SpamError } from 'remix-utils/honeypot/server';
import { honeypot } from '~/honeypot.server.ts';

export async function checkHoneypot(formData: FormData) {
  try {
    await honeypot.check(formData);
  } catch (error) {
    if (error instanceof SpamError) {
      throw new Response('Form not submitted properly', { status: 400 });
    }

    throw error;
  }
}
