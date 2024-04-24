export type Env = {
  POSTGRES_URL: string;
  LOGGING: 'debug' | 'info' | 'warn' | 'error';
  NODE_ENV: 'development' | 'test' | 'production';
  isProduction: boolean;
  isDevelopment: boolean;
};
