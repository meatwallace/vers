export type Env = {
  NODE_ENV: 'development' | 'test' | 'production';
  LOGGING: 'debug' | 'info' | 'warn' | 'error';
  isProduction: boolean;
  isDevelopment: boolean;
};
