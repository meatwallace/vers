import { sessions } from '@chrono/postgres-schema';
import {
  CreateSessionRequest,
  DeleteSessionRequest,
  GetSessionRequest,
  GetSessionsRequest,
  RefreshTokensRequest,
} from '@chrono/service-types';
import { ServiceContext } from '../utils/types';

export type SessionServiceContext = ServiceContext;

export type SessionData = Omit<typeof sessions.$inferSelect, 'refreshToken'>;

export interface AuthPayload {
  accessToken: string;
  refreshToken: string;
  session: SessionData;
}

export interface SessionService {
  createSession: (args: CreateSessionRequest) => Promise<AuthPayload>;
  deleteSession: (args: DeleteSessionRequest) => Promise<true>;
  getSession: (args: GetSessionRequest) => Promise<SessionData | null>;
  getSessions: (args: GetSessionsRequest) => Promise<Array<SessionData>>;
  refreshTokens: (args: RefreshTokensRequest) => Promise<AuthPayload>;
}
