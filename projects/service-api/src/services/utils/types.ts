import { ServiceID } from '@chrono/service-types';
import { Got } from 'got';

export interface ServiceContext {
  client: Got;
}

export interface CreateServiceContextConfig {
  accessToken?: null | string;
  apiURL: string;
  requestID: string;
  serviceID: ServiceID;
}
