import { http, HttpResponse } from 'msw';
import { GetSessionRequest } from '@chrono/service-types';
import { env } from '~/env';
import { db } from '../../db';

const ENDPOINT_URL = `${env.SESSIONS_SERVICE_URL}get-session`;

export const getSession = http.post<never, GetSessionRequest>(
  ENDPOINT_URL,
  async ({ request }) => {
    const body = await request.json();

    const session = db.session.findFirst({
      where: { id: { equals: body.id } },
    });

    return HttpResponse.json({ success: true, data: session });
  },
);
