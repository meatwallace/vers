import { http, HttpResponse } from 'msw';
import { CreateSessionRequest } from '@chrono/service-types';
import { env } from '~/env';
import { db } from '../../db';

const ENDPOINT_URL = `${env.SESSIONS_SERVICE_URL}create-session`;

const EXPIRES_AT_OFFSET = 1000 * 60 * 60 * 24 * 1;
const EXPIRES_AT_REMEMBER_ME_OFFSET = 1000 * 60 * 60 * 24 * 30;

export const createSession = http.post(ENDPOINT_URL, async ({ request }) => {
  const data = (await request.json()) as CreateSessionRequest;

  const expiresAt = data.rememberMe
    ? new Date(Date.now() + EXPIRES_AT_REMEMBER_ME_OFFSET)
    : new Date(Date.now() + EXPIRES_AT_OFFSET);

  const session = db.session.create({
    userID: data.userID,
    ipAddress: data.ipAddress,
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
});
