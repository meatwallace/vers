import { http, HttpResponse } from 'msw';
import { CreateUserRequest } from '@chrono/service-types';
import { env } from '~/env';
import { db } from '../../db';

const ENDPOINT_URL = `${env.USERS_SERVICE_URL}create-user`;

export const createUser = http.post(ENDPOINT_URL, async ({ request }) => {
  const { email, name, username } = (await request.json()) as CreateUserRequest;

  const user = db.user.create({
    email,
    name,
    username,
  });

  return HttpResponse.json({
    success: true,
    data: user,
  });
});
