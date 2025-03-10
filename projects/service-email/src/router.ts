import { procedure as sendEmailProcedure } from './handlers/send-email';
import { t } from './t';

export const router = t.router({
  sendEmail: sendEmailProcedure,
});
