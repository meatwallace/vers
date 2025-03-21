import { procedure as createSessionProcedure } from './handlers/create-session';
import { procedure as deleteSessionProcedure } from './handlers/delete-session';
import { procedure as getSessionProcedure } from './handlers/get-session';
import { procedure as getSessionsProcedure } from './handlers/get-sessions';
import { procedure as refreshTokensProcedure } from './handlers/refresh-tokens';
import { procedure as verifySessionProcedure } from './handlers/verify-session';
import { t } from './t';

export const router = t.router({
  createSession: createSessionProcedure,
  deleteSession: deleteSessionProcedure,
  getSession: getSessionProcedure,
  getSessions: getSessionsProcedure,
  refreshTokens: refreshTokensProcedure,
  verifySession: verifySessionProcedure,
});
