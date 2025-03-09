/**
 * This is a fallback handler for verification types that are not supported
 * by our `/verify-otp` route. We implement custom UI and handling for
 * some cases i.e. initial enabling of 2FA.
 */
// eslint-disable-next-line @typescript-eslint/require-await
export async function handleUnsupported(): Promise<Response> {
  throw new Error('Unsupported verification type');
}
