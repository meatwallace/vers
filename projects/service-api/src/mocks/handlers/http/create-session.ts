import { http, HttpResponse } from 'msw';
import { env } from '~/env';
import { CreateSessionRequest } from '@chrono/service-types';
import { db } from '../../db';

const ENDPOINT_URL = `${env.SESSIONS_SERVICE_URL}create-session`;

const EXPIRES_AT_OFFSET = 1000 * 60 * 60 * 24 * 1;
const EXPIRES_AT_REMEMBER_ME_OFFSET = 1000 * 60 * 60 * 24 * 30;

export const createSession = http.post<never, CreateSessionRequest>(
  ENDPOINT_URL,
  async ({ request }) => {
    const body = await request.json();

    const expiryOffset = body.rememberMe
      ? EXPIRES_AT_REMEMBER_ME_OFFSET
      : EXPIRES_AT_OFFSET;

    const expiresAt = body.expiresAt
      ? new Date(body.expiresAt)
      : new Date(Date.now() + expiryOffset);

    const session = db.session.create({
      userID: body.userID,
      ipAddress: body.ipAddress,
      refreshToken: `refresh_token_${Date.now()}`,
      expiresAt,
    });

    const { refreshToken, ...sessionData } = session;

    return HttpResponse.json({
      success: true,
      data: {
        accessToken: `access_token_${Date.now()}`,
        refreshToken,
        ...sessionData,
      },
    });
  },
);
