import { http, HttpResponse } from 'msw';
import { DeleteSessionRequest } from '@chrono/service-types';
import { env } from '~/env';
import { db } from '../../db';

const ENDPOINT_URL = `${env.SESSIONS_SERVICE_URL}delete-session`;

export const deleteSession = http.post(ENDPOINT_URL, async ({ request }) => {
  const { id, userID } = (await request.json()) as DeleteSessionRequest;

  // eslint-disable-next-line drizzle/enforce-delete-with-where
  db.session.delete({
    where: {
      id: { equals: id },
      userID: { equals: userID },
    },
  });

  return HttpResponse.json({
    success: true,
    data: {},
  });
});
