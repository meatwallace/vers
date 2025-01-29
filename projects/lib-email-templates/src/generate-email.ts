import { render } from '@react-email/components';

type EmailConfig = {
  component: React.ReactElement;
};

type EmailData = {
  html: string;
  plainText: string;
};

export async function generateEmail(config: EmailConfig): Promise<EmailData> {
  const [html, plainText] = await Promise.all([
    render(config.component),
    render(config.component, { plainText: true }),
  ]);

  return { html, plainText };
}
