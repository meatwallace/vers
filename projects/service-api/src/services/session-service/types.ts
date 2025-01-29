import { sessions } from '@chrono/postgres-schema';
import {
  CreateSessionRequest,
  GetSessionsRequest,
  RefreshTokensRequest,
  DeleteSessionRequest,
} from '@chrono/service-types';
import { ServiceContext } from '../utils/types';

export type SessionServiceContext = ServiceContext;

export type SessionData = Omit<typeof sessions.$inferSelect, 'refreshToken'>;

export type AuthPayload = {
  accessToken: string;
  refreshToken: string;
  session: SessionData;
};

export type SessionService = {
  createSession: (args: CreateSessionRequest) => Promise<AuthPayload>;
  deleteSession: (args: DeleteSessionRequest) => Promise<true>;
  getSessions: (args: GetSessionsRequest) => Promise<Array<SessionData>>;
  refreshTokens: (args: RefreshTokensRequest) => Promise<AuthPayload>;
};
