import { ChangePasswordRequest } from '@chrono/service-types';
import { http, HttpResponse } from 'msw';
import { env } from '~/env';
import { db } from '~/mocks/db';

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
          error: 'User not found',
          success: false,
        });
      }

      const isTokenMismatch = user.passwordResetToken !== body.resetToken;

      if (isTokenMismatch) {
        return HttpResponse.json({
          error: 'Invalid reset token',
          success: false,
        });
      }

      const isTokenExpired =
        user.passwordResetTokenExpiresAt &&
        user.passwordResetTokenExpiresAt < new Date();

      if (isTokenExpired) {
        return HttpResponse.json({
          error: 'Reset token expired',
          success: false,
        });
      }

      db.user.update({
        data: {
          passwordHash: body.password,
          passwordResetToken: null,
          passwordResetTokenExpiresAt: null,
        },
        where: {
          id: { equals: user.id },
        },
      });

      db.session.deleteMany({
        where: {
          userID: { equals: user.id },
        },
      });

      return HttpResponse.json({
        data: {},
        success: true,
      });
    } catch {
      return HttpResponse.json(
        {
          error: 'An unknown error occurred',
          success: false,
        },
        { status: 500 },
      );
    }
  },
);
