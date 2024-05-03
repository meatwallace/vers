import { Got } from 'got';

export type ServiceContext = {
  client: Got;
};

export type CreateServiceContextConfig = {
  apiURL: string;
  accessToken?: string | null;
};
