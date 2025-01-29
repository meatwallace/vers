import { z } from 'zod';

export const UserEmailSchema = z
  .string({ required_error: 'Email is required' })
  .email({ message: 'Email is invalid' })
  .min(3, { message: 'Email is too short' })
  .max(100, { message: 'Email is too long' })

  // users can type the email in any case, but we store it in lowercase
  .transform((value) => value.toLowerCase());
