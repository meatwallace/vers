import { verifications } from '@chrono/postgres-schema';
import { VerificationType } from '../types/verification-type';

/**
 * @description Maps GraphQL enum values to database enum values for verification types
 * @remarks Ensures consistent mapping between GraphQL and database enums
 */
export function resolveVerificationType(
  type: VerificationType,
): (typeof verifications.type.enumValues)[number] {
  return VERIFICATION_TYPE_MAP[type];
}

type VerificationTypeMap = Record<
  VerificationType,
  (typeof verifications.type.enumValues)[number]
>;

const VERIFICATION_TYPE_MAP: VerificationTypeMap = {
  [VerificationType.TWO_FACTOR_AUTH]: '2fa',
  [VerificationType.CHANGE_EMAIL]: 'change-email',
  [VerificationType.ONBOARDING]: 'onboarding',
  [VerificationType.RESET_PASSWORD]: 'reset-password',
} as const;
