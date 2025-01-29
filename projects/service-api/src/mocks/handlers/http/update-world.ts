import { http, HttpResponse } from 'msw';
import { UpdateWorldRequest, UpdateWorldResponse } from '@chrono/service-types';
import * as schema from '@chrono/postgres-schema';
import { omitNullish } from '~/utils/omit-nullish.ts';
import { env } from '~/env.ts';
import { db } from '../../db.ts';

const ENDPOINT_URL = `${env.WORLDS_SERVICE_URL}update-world`;

export const updateWorld = http.post(ENDPOINT_URL, async ({ request }) => {
  const { worldID, ...update } = (await request.json()) as UpdateWorldRequest;

  const world = db.world.update({
    where: { id: { equals: worldID } },
    data: omitNullish(update),
  });

  if (!world) {
    return new HttpResponse(null, { status: 404 });
  }

  const response: UpdateWorldResponse = {
    success: true,
    data: world as typeof schema.worlds.$inferSelect,
  };

  return HttpResponse.json(response);
});
