import { ServiceResponse } from './service-response';

export interface SessionData {
  id: string;
  expiresAt: Date;
  ipAddress: string;
  userID: string;
  createdAt: Date;
  updatedAt: Date;
}

interface SessionTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * prioritizes the `expiresAt` parameter over the `rememberMe` flag
 */
export interface CreateSessionRequest {
  userID: string;
  ipAddress: string;
  rememberMe?: boolean;
  expiresAt?: Date;
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

export type GetSessionResponse = ServiceResponse<SessionData | null>;

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
