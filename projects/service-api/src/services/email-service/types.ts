import { SendEmailRequest } from '@vers/service-types';
import { ServiceContext } from '../utils/types';

export type EmailServiceContext = ServiceContext;

export interface EmailService {
  sendEmail: (args: SendEmailRequest) => Promise<void>;
}
