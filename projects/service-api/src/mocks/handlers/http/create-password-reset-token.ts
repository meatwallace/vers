import { CreatePasswordResetTokenRequest } from '@vers/service-types';
import { http, HttpResponse } from 'msw';
import { env } from '~/env';
import { db } from '~/mocks/db';

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
      error: 'User not found',
      success: false,
    });
  }

  if (!user.passwordHash) {
    return HttpResponse.json({
      error: 'User has no password',
      success: false,
    });
  }

  const resetToken = `mock_reset_token_${Date.now()}`;

  db.user.update({
    data: {
      passwordResetToken: resetToken,
      passwordResetTokenExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
    },
    where: {
      id: { equals: user.id },
    },
  });

  return HttpResponse.json({
    data: {
      resetToken,
    },
    success: true,
  });
});
