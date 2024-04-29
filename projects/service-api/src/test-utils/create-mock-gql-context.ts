import { Context } from '../types';
import { createUserService } from '../services';
import { env } from '../env';

type MockContextConfig = {
  accessToken: string;
};

export function createMockGQLContext(config: MockContextConfig): Context {
  const request = new Request('https://test.com/');

  request.headers.set('authorization', `Bearer ${config.accessToken}`);

  return {
    request,
    services: {
      users: createUserService({
        apiURL: env.USERS_API_URL,
        accessToken: config.accessToken,
      }),
    },
  };
}
