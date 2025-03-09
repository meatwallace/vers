import invariant from 'tiny-invariant';
import { HandleVerificationContext } from './types';

/**
 * This is a fallback handler for verification types that are not supported
 * by our `/verify-otp` route. We implement custom UI and handling for
 * some cases i.e. initial enabling of 2FA.
 */
// eslint-disable-next-line @typescript-eslint/require-await
export async function handleUnsupported(
  ctx: HandleVerificationContext,
): Promise<Response> {
  invariant(
    ctx.submission.status === 'success',
    'Attempted to handle unsupported verification type',
  );

  throw new Error(
    `Attempted to handle unsupported verification type (${ctx.submission.value.type})`,
  );
}
