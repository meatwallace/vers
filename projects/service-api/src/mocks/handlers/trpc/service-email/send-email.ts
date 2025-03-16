import { vi } from 'vitest';
import { SendEmailArgs } from '@vers/service-types';
import { trpc } from './trpc';

export const sentEmails = new Map<string, Array<SendEmailArgs>>();

export const sendEmailHandler = vi.fn(({ input }: { input: SendEmailArgs }) => {
  const emails = sentEmails.get(input.to) ?? [];

  sentEmails.set(input.to, [...emails, input]);

  return {};
});

export const sendEmail = trpc.sendEmail.mutation(sendEmailHandler);
