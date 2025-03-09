import { GenerateWorldNamesRequest } from '@chrono/service-types';
import { http, HttpResponse } from 'msw';
import { env } from '~/env';

const ENDPOINT_URL = `${env.WORLDS_SERVICE_URL}generate-world-names`;

export const generateWorldNames = http.post<never, GenerateWorldNamesRequest>(
  ENDPOINT_URL,
  async ({ request }) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const body = await request.json();

    const names = [
      'The Mystical Realm',
      'The Ancient Kingdom',
      'The Lost Empire',
      'The Enchanted Lands',
      'The Forgotten Realm',
    ];

    return HttpResponse.json({ data: names, success: true });
  },
);
