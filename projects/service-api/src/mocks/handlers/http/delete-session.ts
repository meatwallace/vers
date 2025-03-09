import { DeleteSessionRequest } from '@chrono/service-types';
import { http, HttpResponse } from 'msw';
import { env } from '~/env';
import { db } from '../../db';

const ENDPOINT_URL = `${env.SESSIONS_SERVICE_URL}delete-session`;

export const deleteSession = http.post<never, DeleteSessionRequest>(
  ENDPOINT_URL,
  async ({ request }) => {
    const body = await request.json();

    db.session.delete({
      where: {
        id: { equals: body.id },
        userID: { equals: body.userID },
      },
    });

    return HttpResponse.json({
      data: {},
      success: true,
    });
  },
);
