import { z } from 'zod';

export const PasswordSchema = z
  .string({ required_error: 'Password is required' })
  .min(8, { message: 'Password must be 8+ characters' })
  .max(100, { message: 'Password is too long' });
