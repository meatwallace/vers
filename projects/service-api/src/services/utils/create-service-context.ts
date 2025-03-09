import got from 'got';
import { logger } from '~/logger';
import { CreateServiceContextConfig, ServiceContext } from './types';

export function createServiceContext(
  config: CreateServiceContextConfig,
): ServiceContext {
  const client = got.extend({
    headers: {
      'x-request-id': config.requestID,
      ...(config.accessToken
        ? { Authorization: `Bearer ${config.accessToken}` }
        : {}),
    },
    hooks: {
      afterResponse: [
        (response) => {
          const shortRequestID = config.requestID.slice(0, 8);

          logger.info(
            { requestID: config.requestID },
            `(${shortRequestID}) <-- ${response.statusCode.toString()} ${response.url}`,
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
      beforeRequest: [
        (options) => {
          const shortRequestID = config.requestID.slice(0, 8);

          logger.info(
            { requestID: config.requestID },
            `(${shortRequestID}) --> ${options.method} ${options.url?.toString() ?? ''}`,
          );
        },
      ],
    },
    prefixUrl: config.apiURL,
    responseType: 'json',
  });

  return {
    client,
  };
}
