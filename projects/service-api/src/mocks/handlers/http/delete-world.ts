import { http, HttpResponse } from 'msw';
import { DeleteWorldRequest } from '@chrono/service-types';
import { env } from '~/env';
import { db } from '../../db';

const ENDPOINT_URL = `${env.WORLDS_SERVICE_URL}delete-world`;

export const deleteWorld = http.post<never, DeleteWorldRequest>(
  ENDPOINT_URL,
  async ({ request }) => {
    const body = await request.json();

    db.world.delete({ where: { id: { equals: body.worldID } } });

    return HttpResponse.json({
      success: true,
      data: { deletedID: body.worldID },
    });
  },
);
