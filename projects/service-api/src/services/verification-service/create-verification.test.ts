import { ServiceID } from '@chrono/service-types';
import { drop } from '@mswjs/data';
import { createId } from '@paralleldrive/cuid2';
import { env } from '~/env';
import { db } from '~/mocks/db';
import { createServiceContext } from '../utils';
import { createVerification } from './create-verification';

afterEach(() => {
  drop(db);
});

test('it creates a new verification', async () => {
  const ctx = createServiceContext({
    requestID: createId(),
    serviceID: ServiceID.ServiceVerification,
    apiURL: env.VERIFICATIONS_SERVICE_URL,
  });

  const now = Date.now();

  const args = {
    type: 'onboarding',
    target: 'test@example.com',
    period: 300,
    expiresAt: new Date(now + 10 * 60 * 1000),
  } as const;

  const result = await createVerification(args, ctx);

  expect(result).toMatchObject({
    code: expect.any(String),
    verification: {
      type: 'onboarding',
      target: 'test@example.com',
    },
  });
});
