import { z } from 'zod';
import { PasswordSchema } from './password-schema.ts';

export const ConfirmPasswordSchema = z
  .object({ confirmPassword: PasswordSchema, password: PasswordSchema })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'The passwords must match',
        path: ['confirmPassword'],
      });
    }
  });
