import { http, HttpResponse } from 'msw';
import { UpdateWorldArgs } from '../../../services/world-service/types';
import { omitNullish } from '../../../utils';
import { env } from '../../../env';
import { db } from '../../db';

const ENDPOINT_URL = `${env.WORLDS_SERVICE_URL}update-world`;

export const updateWorld = http.post(ENDPOINT_URL, async ({ request }) => {
  const { worldID, ...update } = (await request.json()) as UpdateWorldArgs;

  const world = db.world.update({
    where: { id: { equals: worldID } },
    data: omitNullish(update),
  });

  return HttpResponse.json({ success: true, data: world });
});
