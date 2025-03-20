import { vi } from 'vitest';
import { trpc } from './trpc';

interface SendEmailInput {
  html: string;
  plainText: string;
  subject: string;
  to: string;
}

interface SendEmailProcedureArgs {
  input: SendEmailInput;
}

export const sentEmails = new Map<string, Array<SendEmailInput>>();

export const sendEmailHandler = vi.fn((args: SendEmailProcedureArgs) => {
  const emails = sentEmails.get(args.input.to) ?? [];

  sentEmails.set(args.input.to, [...emails, args.input]);

  return {};
});

export const sendEmail = trpc.sendEmail.mutation(sendEmailHandler);
