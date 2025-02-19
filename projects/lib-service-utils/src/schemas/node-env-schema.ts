import { z } from 'zod';

/**
 * Reusable schema for NODE_ENV environment variable.
 * Enforces our standard environment types across all services.
 */
export const NodeEnvSchema = z.enum([
  'development',
  'test',
  'production',
  'e2e',
]);
