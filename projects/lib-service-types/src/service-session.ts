import { ServiceResponse } from './service-response';

export interface SessionData {
  createdAt: Date;
  expiresAt: Date;
  id: string;
  ipAddress: string;
  updatedAt: Date;
  userID: string;
}

interface SessionTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * prioritizes the `expiresAt` parameter over the `rememberMe` flag
 */
export interface CreateSessionRequest {
  expiresAt?: Date;
  ipAddress: string;
  rememberMe?: boolean;
  userID: string;
}

export type CreateSessionResponse = ServiceResponse<
  SessionData & SessionTokens
>;

export interface DeleteSessionRequest {
  id: string;
  userID: string;
}

export type DeleteSessionResponse = ServiceResponse<Record<string, never>>;

export interface GetSessionRequest {
  id: string;
}

export type GetSessionResponse = ServiceResponse<null | SessionData>;

export interface GetSessionsRequest {
  userID: string;
}

export type GetSessionsResponse = ServiceResponse<Array<SessionData>>;

export interface RefreshTokensRequest {
  refreshToken: string;
}

export type RefreshTokensResponse = ServiceResponse<
  SessionData & SessionTokens
>;

export interface GetTokensRequest {
  sessionID: string;
  userID: string;
}

export type GetTokensResponse = ServiceResponse<SessionData & SessionTokens>;
