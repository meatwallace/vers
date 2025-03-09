import { GetWorldsRequest } from '@chrono/service-types';
import { http, HttpResponse } from 'msw';
import { env } from '~/env';
import { db } from '../../db';

const ENDPOINT_URL = `${env.WORLDS_SERVICE_URL}get-worlds`;

export const getWorlds = http.post<never, GetWorldsRequest>(
  ENDPOINT_URL,
  async ({ request }) => {
    const body = await request.json();

    const worlds = db.world.findMany({
      where: { ownerID: { equals: body.ownerID } },
    });

    return HttpResponse.json({ data: worlds, success: true });
  },
);
