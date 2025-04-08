import * as E from '@react-email/components';
import { generateEmail } from './generate-email';
import { ExistingAccountEmail } from './templates/existing-account-email';

interface Config {
  email: string;
}

export async function generateExistingAccountEmail(config: Config) {
  return generateEmail({
    component: (
      <E.Html dir="ltr" lang="en">
        <ExistingAccountEmail email={config.email} />
      </E.Html>
    ),
  });
}
