import { createServiceContext } from '../utils';
import { CreateServiceContextConfig } from '../utils/types';
import { sendEmail } from './send-email';
import { EmailService } from './types';

type EmailServiceConfig = CreateServiceContextConfig;

export function createEmailService(config: EmailServiceConfig): EmailService {
  const ctx = createServiceContext(config);

  return {
    sendEmail: (args) => sendEmail(args, ctx),
  };
}
