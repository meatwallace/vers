import { builder } from '../builder';

/**
 * The type of verification that is being requested. This binds the verification
 * instance to a specific action the user is trying to complete.
 *
 * @enum {string}
 * @property {string} ONBOARDING - Used to verify the user's email address when they sign up.
 * @property {string} CHANGE_EMAIL_CONFIRMATION - Used to verify the user's email address when they change their email address.
 * @property {string} RESET_PASSWORD - Used to verify the user's 2FA code prior to resetting their password.
 * @property {string} TWO_FACTOR_AUTH - Used to verify the user's 2FA code for login.
 * @property {string} TWO_FACTOR_AUTH_SETUP - Used to verify the user's 2FA code during 2FA setup.
 * @property {string} TWO_FACTOR_AUTH_DISABLE - Used to verify the users' 2FA code prior to disabling 2FA for the user.
 * @property {string} CHANGE_PASSWORD - Used to step-up authorization to allow a user to change their password.
 * @property {string} CHANGE_EMAIL - Used to step-up authorization to allow a user to change their email address.
 */
export enum VerificationType {
  ONBOARDING = 'ONBOARDING',
  CHANGE_EMAIL_CONFIRMATION = 'CHANGE_EMAIL_CONFIRMATION',
  RESET_PASSWORD = 'RESET_PASSWORD',
  TWO_FACTOR_AUTH = 'TWO_FACTOR_AUTH',
  TWO_FACTOR_AUTH_SETUP = 'TWO_FACTOR_AUTH_SETUP',
  TWO_FACTOR_AUTH_DISABLE = 'TWO_FACTOR_AUTH_DISABLE',
  CHANGE_EMAIL = 'CHANGE_EMAIL',
  CHANGE_PASSWORD = 'CHANGE_PASSWORD',
}

builder.enumType(VerificationType, {
  name: 'VerificationType',
});
