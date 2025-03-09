import { UpdateWorldRequest } from '@chrono/service-types';
import { http, HttpResponse } from 'msw';
import { env } from '~/env.ts';
import { omitNullish } from '~/utils/omit-nullish.ts';
import { db } from '../../db.ts';

const ENDPOINT_URL = `${env.WORLDS_SERVICE_URL}update-world`;

export const updateWorld = http.post<never, UpdateWorldRequest>(
  ENDPOINT_URL,
  async ({ request }) => {
    const body = await request.json();
    const { worldID, ...update } = body;

    const world = db.world.update({
      data: omitNullish(update),
      where: { id: { equals: worldID } },
    });

    if (!world) {
      return new HttpResponse(null, { status: 404 });
    }

    const response = {
      data: world,
      success: true,
    };

    return HttpResponse.json(response);
  },
);
