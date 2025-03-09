import { CreateUserRequest } from '@vers/service-types';
import { http, HttpResponse } from 'msw';
import { env } from '~/env';
import { db } from '../../db';

const ENDPOINT_URL = `${env.USERS_SERVICE_URL}create-user`;

export const createUser = http.post<never, CreateUserRequest>(
  ENDPOINT_URL,
  async ({ request }) => {
    const body = await request.json();

    const user = db.user.create({
      email: body.email,
      name: body.name,
      username: body.username,
    });

    return HttpResponse.json({
      data: user,
      success: true,
    });
  },
);
