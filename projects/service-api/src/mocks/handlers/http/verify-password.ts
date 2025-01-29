import { http, HttpResponse } from 'msw';
import { VerifyPasswordRequest } from '@chrono/service-types';
import { env } from '~/env';
import { db } from '../../db';

const ENDPOINT_URL = `${env.USERS_SERVICE_URL}verify-password`;

export const verifyPassword = http.post(ENDPOINT_URL, async ({ request }) => {
  const { email, password } = (await request.json()) as VerifyPasswordRequest;

  const user = db.user.findFirst({
    where: { email: { equals: email } },
  });

  if (!user) {
    return HttpResponse.json({
      success: false,
      error: 'No user with that email',
    });
  }

  if (user.passwordHash === null) {
    return HttpResponse.json({
      success: false,
      error: 'User does not have a password set',
    });
  }

  // for the sake of our msw mocks we just store the raw password instead of the hash
  if (password !== user.passwordHash) {
    return HttpResponse.json({
      success: false,
      error: 'Incorrect password',
    });
  }

  return HttpResponse.json({
    success: true,
    data: {},
  });
});
