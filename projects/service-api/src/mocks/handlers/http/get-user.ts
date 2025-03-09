import { GetUserRequest } from '@vers/service-types';
import { http, HttpResponse } from 'msw';
import { env } from '~/env';
import { db } from '../../db';

const ENDPOINT_URL = `${env.USERS_SERVICE_URL}get-user`;

export const getUser = http.post<never, GetUserRequest>(
  ENDPOINT_URL,
  async ({ request }) => {
    const body = await request.json();

    if (!body.id && !body.email) {
      return new HttpResponse(null, { status: 400 });
    }

    const user = db.user.findFirst({
      where: {
        ...(body.id && { id: { equals: body.id } }),
        ...(body.email && { email: { equals: body.email } }),
      },
    });

    return HttpResponse.json({ data: user, success: true });
  },
);
