import { http, HttpResponse } from 'msw';
import { GetSessionsRequest } from '@chrono/service-types';
import { env } from '~/env';
import { db } from '../../db';

const ENDPOINT_URL = `${env.SESSIONS_SERVICE_URL}get-sessions`;

export const getSessions = http.post(ENDPOINT_URL, async ({ request }) => {
  const { userID } = (await request.json()) as GetSessionsRequest;

  const sessions = db.session.findMany({
    where: { userID: { equals: userID } },
  });

  const sessionsWithoutRefreshTokens = sessions.map(
    ({ refreshToken, ...session }) => session,
  );

  return HttpResponse.json({
    success: true,
    data: sessionsWithoutRefreshTokens,
  });
});
