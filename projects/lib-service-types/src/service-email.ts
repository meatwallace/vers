import { ServiceResponse } from './service-response';

export interface SendEmailRequest {
  html: string;
  plainText: string;
  subject: string;
  to: string;
}

export type SendEmailResponse = ServiceResponse<Record<string, never>>;
