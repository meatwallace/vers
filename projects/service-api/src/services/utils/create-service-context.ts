import got from 'got';
import { logger } from '~/logger';
import { CreateServiceContextConfig, ServiceContext } from './types';

export function createServiceContext(
  config: CreateServiceContextConfig,
): ServiceContext {
  const client = got.extend({
    prefixUrl: config.apiURL,
    responseType: 'json',
    headers: {
      'x-request-id': config.requestID,
      ...(config.accessToken
        ? { Authorization: `Bearer ${config.accessToken}` }
        : {}),
    },
    hooks: {
      beforeRequest: [
        (options) => {
          const shortRequestID = config.requestID.slice(0, 8);

          logger.info(
            { requestID: config.requestID },
            `(${shortRequestID}) --> ${options.method} ${options.url}`,
          );
        },
      ],
      afterResponse: [
        async (response) => {
          const shortRequestID = config.requestID.slice(0, 8);

          logger.info(
            { requestID: config.requestID },
            `(${shortRequestID}) <-- ${response.statusCode} ${response.url}`,
          );

          return response;
        },
      ],
      beforeError: [
        (error) => {
          const shortRequestID = config.requestID.slice(0, 8);

          logger.error(
            { requestID: config.requestID },
            `(${shortRequestID}) <-- ${error.code} ${error.message}`,
          );

          return error;
        },
      ],
    },
  });

  return {
    client,
  };
}
