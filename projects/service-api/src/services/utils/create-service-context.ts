import got from 'got';
import { CreateServiceContextConfig, ServiceContext } from './types';

export function createServiceContext(
  config: CreateServiceContextConfig,
): ServiceContext {
  const client = got.extend({
    prefixUrl: config.apiURL,
    responseType: 'json',
    headers: {
      ...(config.accessToken
        ? { Authorization: `Bearer ${config.accessToken}` }
        : {}),
    },
  });

  return {
    client,
  };
}
