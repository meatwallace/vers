import { http, HttpResponse } from 'msw';
import { GetWorldArgs } from '../../../services/world-service/types';
import { env } from '../../../env';
import { db } from '../../db';

const ENDPOINT_URL = `${env.WORLDS_SERVICE_URL}get-world`;

export const getWorld = http.post(ENDPOINT_URL, async ({ request }) => {
  const { worldID } = (await request.json()) as GetWorldArgs;

  const world = db.world.findFirst({
    where: { id: { equals: worldID } },
  });

  return HttpResponse.json({ success: true, data: world });
});
