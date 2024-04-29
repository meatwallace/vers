import { http, HttpResponse } from 'msw';
import {
  createTokenVerifier,
  getTokenFromHeader,
} from '@campaign/service-utils';
import { env } from '../../../env';
import { db } from '../../db';

const verifyToken = createTokenVerifier({
  audience: env.API_IDENTIFIER,
  issuer: `https://${env.AUTH0_DOMAIN}/`,
});

const ENDPOINT_URL = `${env.USERS_API_URL}get-current-user`;

export const getCurrentUser = http.get(ENDPOINT_URL, async ({ request }) => {
  const authHeader = request.headers.get('authorization');
  const accessToken = getTokenFromHeader(authHeader);

  if (!accessToken) {
    return new HttpResponse(null, { status: 401 });
  }

  const payload = (await verifyToken(accessToken)) as { sub: string };

  const userID = payload.sub;
  const user = db.user.findFirst({ where: { id: { equals: userID } } });

  return HttpResponse.json({ success: true, data: user });
});
