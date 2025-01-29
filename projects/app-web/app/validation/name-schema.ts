import { z } from 'zod';

export const NameSchema = z
  .string({ required_error: 'Name is required' })
  .min(3, { message: 'Name is too short' })
  .max(40, { message: 'Name is too long' });
