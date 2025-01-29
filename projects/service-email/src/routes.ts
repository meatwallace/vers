import { app } from './app';
import { sendEmail } from './handlers/send-email';

app.post('/send-email', sendEmail);
