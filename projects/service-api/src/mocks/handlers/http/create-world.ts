import { http, HttpResponse } from 'msw';
import { CreateWorldRequest, CreateWorldResponse } from '@chrono/service-types';
import { env } from '~/env';
import { db } from '../../db';

const ENDPOINT_URL = `${env.WORLDS_SERVICE_URL}create-world`;

export const createWorld = http.post(ENDPOINT_URL, async ({ request }) => {
  const body = (await request.json()) as CreateWorldRequest;

  const world = db.world.create({
    ownerID: body.ownerID,
  });

  const response: CreateWorldResponse = {
    success: true,
    data: world,
  };

  return HttpResponse.json(response);
});
