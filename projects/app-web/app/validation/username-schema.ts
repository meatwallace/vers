import { z } from 'zod';

export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 20;

export const UsernameSchema = z
  .string({ required_error: 'Username is required' })
  .min(USERNAME_MIN_LENGTH, { message: 'Username is too short' })
  .max(USERNAME_MAX_LENGTH, { message: 'Username is too long' })
  .regex(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only include letters, numbers, and underscores',
  })

  // users can type the username in any case, but we store it in lowercase
  .transform((value) => value.toLowerCase());
