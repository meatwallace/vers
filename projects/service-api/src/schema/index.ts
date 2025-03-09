import { builder } from './builder';

export const schema = builder.toSchema();

// worlds
export { resolve as createWorld } from './mutations/create-world';
// sessions
export { resolve as deleteSession } from './mutations/delete-session';
export { resolve as deleteWorld } from './mutations/delete-world';
export { resolve as finishDisable2FA } from './mutations/finish-disable-2fa';
export { resolve as finishEmailSignup } from './mutations/finish-email-sign-up';

export { resolve as finishEnable2FA } from './mutations/finish-enable-2fa';
export { resolve as finishLoginWith2FA } from './mutations/finish-login-with-2fa';
export { resolve as finishPasswordReset } from './mutations/finish-password-reset';
export { resolve as loginWithPassword } from './mutations/login-with-password';
export { resolve as refreshAccessToken } from './mutations/refresh-access-token';
export { resolve as startDisable2FA } from './mutations/start-disable-2fa';
// auth
export { resolve as startEmailSignup } from './mutations/start-email-sign-up';
// 2fa
export { resolve as startEnable2FA } from './mutations/start-enable-2fa';

export { resolve as startPasswordReset } from './mutations/start-password-reset';
export { resolve as updateWorld } from './mutations/update-world';
export { resolve as verifyOTP } from './mutations/verify-otp';
export { resolve as generateWorldNames } from './queries/generate-world-names';
// users
export { resolve as getCurrentUser } from './queries/get-current-user';

export { resolve as getEnable2FAVerification } from './queries/get-enable-2fa-verification';
export { resolve as getSessions } from './queries/get-sessions';

export { resolve as getWorld } from './queries/get-world';

export { resolve as getWorlds } from './queries/get-worlds';
export { AuthPayload } from './types/auth-payload';
export { MutationError } from './types/mutation-error';
export { MutationErrorPayload } from './types/mutation-error-payload';
export { MutationSuccess } from './types/mutation-success';
export { User } from './types/user';
