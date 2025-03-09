import { ServiceID } from '@chrono/service-types';
import { Got } from 'got';

export interface ServiceContext {
  client: Got;
}

export interface CreateServiceContextConfig {
  requestID: string;
  serviceID: ServiceID;
  apiURL: string;
  accessToken?: string | null;
}
