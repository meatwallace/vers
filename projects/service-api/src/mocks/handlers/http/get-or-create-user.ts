import { http, HttpResponse } from 'msw';
import {
  createTokenVerifier,
  getTokenFromHeader,
} from '@chrononomicon/service-utils';
import { env } from '../../../env';
import { db } from '../../db';

const verifyToken = createTokenVerifier({
  audience: env.API_IDENTIFIER,
  issuer: `https://${env.AUTH0_DOMAIN}/`,
});

const ENDPOINT_URL = `${env.USERS_API_URL}get-or-create-user`;

export const getOrCreateUser = http.post(ENDPOINT_URL, async ({ request }) => {
  const authHeader = request.headers.get('authorization');
  const accessToken = getTokenFromHeader(authHeader);

  if (!accessToken) {
    return new HttpResponse(null, { status: 401 });
  }

  const payload = (await verifyToken(accessToken)) as { sub: string };

  const userID = payload.sub;
  const existingUser = db.user.findFirst({ where: { id: { equals: userID } } });

  if (existingUser) {
    return HttpResponse.json({ success: true, data: existingUser });
  }

  const user = db.user.create({
    id: userID,
    auth0ID: `auth0|${userID}`,
  });

  return HttpResponse.json({ success: true, data: user });
});
