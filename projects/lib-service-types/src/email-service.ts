import { ServiceResponse } from './service-response';

export interface SendEmailRequest {
  to: string;
  subject: string;
  html: string;
  plainText: string;
}

export type SendEmailResponse = ServiceResponse<void>;
