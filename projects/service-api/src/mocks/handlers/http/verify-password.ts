import { VerifyPasswordRequest } from '@chrono/service-types';
import { http, HttpResponse } from 'msw';
import { env } from '~/env';
import { db } from '../../db';

const ENDPOINT_URL = `${env.USERS_SERVICE_URL}verify-password`;

export const verifyPassword = http.post<never, VerifyPasswordRequest>(
  ENDPOINT_URL,
  async ({ request }) => {
    const body = await request.json();

    const user = db.user.findFirst({
      where: { email: { equals: body.email } },
    });

    if (!user) {
      return HttpResponse.json({
        error: 'No user with that email',
        success: false,
      });
    }

    if (user.passwordHash === null) {
      return HttpResponse.json({
        error: 'User does not have a password set',
        success: false,
      });
    }

    // for the sake of our msw mocks we just store the raw password instead of the hash
    if (body.password !== user.passwordHash) {
      return HttpResponse.json({
        error: 'Incorrect password',
        success: false,
      });
    }

    return HttpResponse.json({
      data: {},
      success: true,
    });
  },
);
