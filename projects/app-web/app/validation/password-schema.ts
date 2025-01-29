import { z } from 'zod';

export const PasswordSchema = z
  .string({ required_error: 'Password is required' })
  .min(6, { message: 'Password is too short' })
  .max(100, { message: 'Password is too long' });
