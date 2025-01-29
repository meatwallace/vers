import { http, HttpResponse } from 'msw';
import { GenerateWorldNamesRequest } from '@chrono/service-types';
import { env } from '~/env';

const ENDPOINT_URL = `${env.WORLDS_SERVICE_URL}generate-world-names`;

export const generateWorldNames = http.post(
  ENDPOINT_URL,
  async ({ request }) => {
    (await request.json()) as GenerateWorldNamesRequest;

    const names = [
      'The Mystical Realm',
      'The Ancient Kingdom',
      'The Lost Empire',
      'The Enchanted Lands',
      'The Forgotten Realm',
    ];

    return HttpResponse.json({ success: true, data: names });
  },
);
