import { GetSessionsRequest } from '@vers/service-types';
import { http, HttpResponse } from 'msw';
import { env } from '~/env';
import { db } from '../../db';

const ENDPOINT_URL = `${env.SESSIONS_SERVICE_URL}get-sessions`;

export const getSessions = http.post<never, GetSessionsRequest>(
  ENDPOINT_URL,
  async ({ request }) => {
    const body = await request.json();

    const sessions = db.session.findMany({
      where: { userID: { equals: body.userID } },
    });

    return HttpResponse.json({
      data: sessions,
      success: true,
    });
  },
);
