import { http, HttpResponse } from 'msw';
import { UpdateWorldRequest } from '@chrono/service-types';
import { omitNullish } from '~/utils/omit-nullish.ts';
import { env } from '~/env.ts';
import { db } from '../../db.ts';

const ENDPOINT_URL = `${env.WORLDS_SERVICE_URL}update-world`;

export const updateWorld = http.post<never, UpdateWorldRequest>(
  ENDPOINT_URL,
  async ({ request }) => {
    const body = await request.json();
    const { worldID, ...update } = body;

    const world = db.world.update({
      where: { id: { equals: worldID } },
      data: omitNullish(update),
    });

    if (!world) {
      return new HttpResponse(null, { status: 404 });
    }

    const response = {
      success: true,
      data: world,
    };

    return HttpResponse.json(response);
  },
);
