import { http, HttpResponse } from 'msw';
import { CreatePasswordResetTokenRequest } from '@chrono/service-types';
import { db } from '~/mocks/db';
import { env } from '~/env';

const ENDPOINT_URL = `${env.USERS_SERVICE_URL}create-password-reset-token`;

export const CreatePasswordResetToken = http.post<
  never,
  CreatePasswordResetTokenRequest
>(ENDPOINT_URL, async ({ request }) => {
  const body = await request.json();

  const user = db.user.findFirst({
    where: {
      id: { equals: body.id },
    },
  });

  if (!user) {
    return HttpResponse.json({
      success: false,
      error: 'User not found',
    });
  }

  if (!user.passwordHash) {
    return HttpResponse.json({
      success: false,
      error: 'User has no password',
    });
  }

  const resetToken = `mock_reset_token_${Date.now()}`;

  db.user.update({
    where: {
      id: { equals: user.id },
    },
    data: {
      passwordResetToken: resetToken,
      passwordResetTokenExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
    },
  });

  return HttpResponse.json({
    success: true,
    data: {
      resetToken,
    },
  });
});
