export type Env = {
  LOGGING: 'debug' | 'info' | 'warn' | 'error';
  NODE_ENV: 'development' | 'test' | 'e2e' | 'production';

  // TEST_USER_EMAIL: string;
  // TEST_USER_PASSWORD: string;

  // utils
  isProduction: boolean;
  isDevelopment: boolean;
};
