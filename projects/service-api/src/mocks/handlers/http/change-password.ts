import { http, HttpResponse } from 'msw';
import { ChangePasswordRequest } from '@chrono/service-types';
import { db } from '~/mocks/db';
import { env } from '~/env';

export const ENDPOINT_URL = `${env.USERS_SERVICE_URL}change-password`;

export const changePassword = http.post<never, ChangePasswordRequest>(
  ENDPOINT_URL,
  async ({ request }) => {
    try {
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

      const isTokenMismatch = user.passwordResetToken !== body.resetToken;

      if (isTokenMismatch) {
        return HttpResponse.json({
          success: false,
          error: 'Invalid reset token',
        });
      }

      const isTokenExpired =
        user.passwordResetTokenExpiresAt &&
        user.passwordResetTokenExpiresAt < new Date();

      if (isTokenExpired) {
        return HttpResponse.json({
          success: false,
          error: 'Reset token expired',
        });
      }

      db.user.update({
        where: {
          id: { equals: user.id },
        },
        data: {
          passwordHash: body.password,
          passwordResetToken: null,
          passwordResetTokenExpiresAt: null,
        },
      });

      db.session.deleteMany({
        where: {
          userID: { equals: user.id },
        },
      });

      return HttpResponse.json({
        success: true,
        data: {},
      });
    } catch {
      return HttpResponse.json(
        {
          success: false,
          error: 'An unknown error occurred',
        },
        { status: 500 },
      );
    }
  },
);
