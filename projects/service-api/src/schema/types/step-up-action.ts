import { builder } from '../builder';

/**
 * The type of action that requires step-up authentication (2FA verification).
 * This enum is used to identify different secure operations that require additional
 * verification before proceeding.
 *
 * @enum {string}
 * @property {string} CHANGE_EMAIL - Used when a user wants to change their email address
 * @property {string} CHANGE_PASSWORD - Used when a user wants to change their password
 * @property {string} DISABLE_2FA - Used when a user wants to disable 2FA
 */
export enum StepUpAction {
  CHANGE_EMAIL = 'CHANGE_EMAIL',
  CHANGE_PASSWORD = 'CHANGE_PASSWORD',
  DISABLE_2FA = 'DISABLE_2FA',
}

builder.enumType(StepUpAction, {
  name: 'StepUpAction',
});
