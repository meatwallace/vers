import { builder } from './builder';

export const schema = builder.toSchema();

export { AuthPayload } from './types/auth-payload';
export { MutationError } from './types/mutation-error';
export { MutationErrorPayload } from './types/mutation-error-payload';
export { MutationSuccess } from './types/mutation-success';
export { User } from './types/user';

export { resolve as generateWorldNames } from './queries/generate-world-names';
export { resolve as getWorld } from './queries/get-world';
export { resolve as getWorlds } from './queries/get-worlds';
export { resolve as createWorld } from './mutations/create-world';
export { resolve as deleteWorld } from './mutations/delete-world';
export { resolve as updateWorld } from './mutations/update-world';

export { resolve as startEmailSignup } from './mutations/start-email-sign-up';
export { resolve as finishEmailSignup } from './mutations/finish-email-sign-up';
export { resolve as loginWithPassword } from './mutations/login-with-password';
export { resolve as verifyOTP } from './mutations/verify-otp';
export { resolve as refreshAccessToken } from './mutations/refresh-access-token';

export { resolve as getCurrentUser } from './queries/get-current-user';

export { resolve as getSessions } from './queries/get-sessions';
export { resolve as deleteSession } from './mutations/delete-session';
