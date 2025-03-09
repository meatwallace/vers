import { createSession } from './create-session';
import { getSession } from './get-session';
import { getSessions } from './get-sessions';
import { refreshTokens } from './refresh-tokens';
import { deleteSession } from './delete-session';
import { SessionService } from './types';
import { CreateServiceContextConfig } from '../utils/types';
import { createServiceContext } from '../utils/create-service-context';

type SessionServiceConfig = CreateServiceContextConfig;

export function createSessionService(
  config: SessionServiceConfig,
): SessionService {
  const ctx = createServiceContext(config);

  return {
    createSession: (args) => createSession(args, ctx),
    deleteSession: (args) => deleteSession(args, ctx),
    getSession: (args) => getSession(args, ctx),
    getSessions: (args) => getSessions(args, ctx),
    refreshTokens: (args) => refreshTokens(args, ctx),
  };
}
