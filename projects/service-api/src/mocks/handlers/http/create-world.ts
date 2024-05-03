import { http, HttpResponse } from 'msw';
import { getTokenFromHeader } from '@chrononomicon/service-utils';
import { jwtDecode } from 'jwt-decode';
import { env } from '../../../env';
import { db } from '../../db';

const ENDPOINT_URL = `${env.WORLDS_SERVICE_URL}create-world`;

export const createWorld = http.post(ENDPOINT_URL, async ({ request }) => {
  const authHeader = request.headers.get('authorization');
  const accessToken = getTokenFromHeader(authHeader);

  if (!accessToken) {
    return new HttpResponse(null, { status: 401 });
  }

  const payload = jwtDecode(accessToken);

  if (!payload.sub) {
    return new HttpResponse(null, { status: 401 });
  }

  const user = db.user.findFirst({
    where: { auth0ID: { equals: payload.sub } },
  });

  if (!user) {
    return new HttpResponse(null, { status: 401 });
  }

  const world = db.world.create({
    ownerID: user.id,
  });

  return HttpResponse.json({ success: true, data: world });
});
