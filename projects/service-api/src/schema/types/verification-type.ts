import { builder } from '../builder';

export enum VerificationType {
  TWO_FACTOR_AUTH = 'TWO_FACTOR_AUTH',
  CHANGE_EMAIL = 'CHANGE_EMAIL',
  ONBOARDING = 'ONBOARDING',
  RESET_PASSWORD = 'RESET_PASSWORD',
}

builder.enumType(VerificationType, {
  name: 'VerificationType',
});
