import { SendEmailRequest } from '@chrono/service-types';
import { ServiceContext } from '../utils/types';

export type EmailServiceContext = ServiceContext;

export type EmailService = {
  sendEmail: (args: SendEmailRequest) => Promise<void>;
};
