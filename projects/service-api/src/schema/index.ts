import { rateLimitDirective } from 'graphql-rate-limit-directive';
import { builder } from './builder';
import { getRateLimitKey } from './utils/get-rate-limit-key';

const { rateLimitDirectiveTransformer } = rateLimitDirective({
  keyGenerator: getRateLimitKey,
});

export const schema = rateLimitDirectiveTransformer(builder.toSchema());

// auth
export { resolve as finishEmailSignup } from './mutations/finish-email-sign-up';
export { resolve as finishLoginWith2FA } from './mutations/finish-login-with-2fa';
export { resolve as finishPasswordReset } from './mutations/finish-password-reset';
export { resolve as loginWithPassword } from './mutations/login-with-password';
export { resolve as refreshAccessToken } from './mutations/refresh-access-token';
export { resolve as startEmailSignup } from './mutations/start-email-sign-up';
export { resolve as startPasswordReset } from './mutations/start-password-reset';
export { resolve as verifyOTP } from './mutations/verify-otp';

// 2FA management
export { resolve as finishDisable2FA } from './mutations/finish-disable-2fa';
export { resolve as finishEnable2FA } from './mutations/finish-enable-2fa';
export { resolve as startDisable2FA } from './mutations/start-disable-2fa';
export { resolve as startEnable2FA } from './mutations/start-enable-2fa';
export { resolve as getEnable2FAVerification } from './queries/get-enable-2fa-verification';

// session
export { resolve as deleteSession } from './mutations/delete-session';
export { resolve as getSessions } from './queries/get-sessions';

// user
export { resolve as getCurrentUser } from './queries/get-current-user';

// types
export { AuthPayload } from './types/auth-payload';
export { MutationError } from './types/mutation-error';
export { MutationErrorPayload } from './types/mutation-error-payload';
export { MutationSuccess } from './types/mutation-success';
export { User } from './types/user';
