import { UpdateUserRequest } from '@vers/service-types';
import { http, HttpResponse } from 'msw';
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
      data: {
        ...omitNullish(update),
        updatedAt: new Date(),
      },
      where: {
        id: { equals: id },
      },
    });

    return HttpResponse.json({
      data: user,
      success: true,
    });
  },
);
