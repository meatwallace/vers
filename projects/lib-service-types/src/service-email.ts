import { ServiceResponse } from './service-response';

export type SendEmailRequest = {
  to: string;
  subject: string;
  html: string;
  plainText: string;
};

export type SendEmailResponse = ServiceResponse<Record<string, never>>;
