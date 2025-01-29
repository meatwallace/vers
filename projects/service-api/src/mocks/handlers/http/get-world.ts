import { http, HttpResponse } from 'msw';
import { GetWorldRequest } from '@chrono/service-types';
import { env } from '~/env';
import { db } from '../../db';

const ENDPOINT_URL = `${env.WORLDS_SERVICE_URL}get-world`;

export const getWorld = http.post(ENDPOINT_URL, async ({ request }) => {
  const { worldID } = (await request.json()) as GetWorldRequest;

  const world = db.world.findFirst({
    where: { id: { equals: worldID } },
  });

  return HttpResponse.json({ success: true, data: world });
});
