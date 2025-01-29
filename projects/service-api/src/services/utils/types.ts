import { ServiceID } from '@chrono/service-types';
import { Got } from 'got';

export type ServiceContext = {
  client: Got;
};

export type CreateServiceContextConfig = {
  requestID: string;
  serviceID: ServiceID;
  apiURL: string;
  accessToken?: string | null;
};
