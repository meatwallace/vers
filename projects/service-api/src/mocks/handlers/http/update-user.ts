import { http, HttpResponse } from 'msw';
import { UpdateUserRequest } from '@chrono/service-types';
import { env } from '~/env';
import { omitNullish } from '~/utils/omit-nullish';
import { db } from '../../db';

const ENDPOINT_URL = `${env.USERS_SERVICE_URL}update-user`;

export const updateUser = http.post<never, UpdateUserRequest>(
  ENDPOINT_URL,
  async ({ request }) => {
    const body = await request.json();
    const { id, ...update } = body;

    const user = db.user.update({
      where: {
        id: { equals: id },
      },
      data: {
        ...omitNullish(update),
        updatedAt: new Date(),
      },
    });

    return HttpResponse.json({
      success: true,
      data: user,
    });
  },
);
