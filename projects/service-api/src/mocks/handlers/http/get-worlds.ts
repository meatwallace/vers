import { http, HttpResponse } from 'msw';
import { GetWorldsArgs } from '../../../services/world-service/types';
import { env } from '../../../env';
import { db } from '../../db';

const ENDPOINT_URL = `${env.WORLDS_SERVICE_URL}get-worlds`;

export const getWorlds = http.post(ENDPOINT_URL, async ({ request }) => {
  const { ownerID } = (await request.json()) as GetWorldsArgs;

  const worlds = db.world.findMany({
    where: { ownerID: { equals: ownerID } },
  });

  return HttpResponse.json({ success: true, data: worlds });
});
