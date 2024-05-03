import { http, HttpResponse } from 'msw';
import { getTokenFromHeader } from '@chrononomicon/service-utils';
import { jwtDecode } from 'jwt-decode';
import { env } from '../../../env';
import { db } from '../../db';

const ENDPOINT_URL = `${env.USERS_SERVICE_URL}get-or-create-user`;

export const getOrCreateUser = http.post(ENDPOINT_URL, async ({ request }) => {
  const authHeader = request.headers.get('authorization');
  const accessToken = getTokenFromHeader(authHeader);

  if (!accessToken) {
    return new HttpResponse(null, { status: 401 });
  }

  const payload = jwtDecode(accessToken);

  if (!payload.sub) {
    return new HttpResponse(null, { status: 401 });
  }

  const existingUser = db.user.findFirst({
    where: { auth0ID: { equals: payload.sub } },
  });

  if (existingUser) {
    return HttpResponse.json({ success: true, data: existingUser });
  }

  const user = db.user.create({
    auth0ID: payload.sub,
  });

  return HttpResponse.json({ success: true, data: user });
});
