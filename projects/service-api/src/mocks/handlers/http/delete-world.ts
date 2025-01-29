import { http, HttpResponse } from 'msw';
import { DeleteWorldRequest } from '@chrono/service-types';
import { env } from '~/env';
import { db } from '../../db';

const ENDPOINT_URL = `${env.WORLDS_SERVICE_URL}delete-world`;

export const deleteWorld = http.post(ENDPOINT_URL, async ({ request }) => {
  const { worldID } = (await request.json()) as DeleteWorldRequest;

  // eslint-disable-next-line drizzle/enforce-delete-with-where
  db.world.delete({ where: { id: { equals: worldID } } });

  return HttpResponse.json({ success: true, data: { deletedID: worldID } });
});
