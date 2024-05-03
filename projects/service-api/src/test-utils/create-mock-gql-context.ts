import { Context } from '../types';
import { createUserService, createWorldService } from '../services';
import { env } from '../env';

type MockContextConfig = {
  accessToken?: string;
};

export function createMockGQLContext(config: MockContextConfig): Context {
  const request = new Request('https://test.com/');

  if (config.accessToken) {
    request.headers.set('authorization', `Bearer ${config.accessToken}`);
  }

  let user: Context['user'] | null = null;

  if (config.accessToken) {
    user = {
      id: 'test_user_id',
      auth0ID: 'auth0|test_id',
      email: 'user@test.com',
      emailVerified: true,
      name: 'Test User',
      firstName: 'Test',
      createdAt: new Date(),
    };
  }

  return {
    request,
    user,
    services: {
      user: createUserService({
        apiURL: env.USERS_SERVICE_URL,
        accessToken: config.accessToken,
      }),
      world: createWorldService({
        apiURL: env.WORLDS_SERVICE_URL,
        accessToken: config.accessToken,
      }),
    },
  };
}
