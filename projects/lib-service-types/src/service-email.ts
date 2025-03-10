export interface SendEmailArgs {
  html: string;
  plainText: string;
  subject: string;
  to: string;
}

export type SendEmailPayload = Record<string, never>;
