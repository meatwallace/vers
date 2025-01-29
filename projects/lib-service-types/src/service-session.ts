import { ServiceResponse } from './service-response';

export type CreateSessionRequest = {
  userID: string;
  ipAddress: string;
  rememberMe?: boolean;
};

export type CreateSessionResponse = ServiceResponse<{
  id: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  ipAddress: string;
  userID: string;
  createdAt: Date;
  updatedAt: Date;
}>;

export type DeleteSessionRequest = {
  id: string;
  userID: string;
};

export type DeleteSessionResponse = ServiceResponse<Record<string, never>>;

export type GetSessionsRequest = {
  userID: string;
};

export type GetSessionsResponse = ServiceResponse<
  Array<{
    id: string;
    expiresAt: Date;
    ipAddress: string;
    userID: string;
    createdAt: Date;
    updatedAt: Date;
  }>
>;

export type RefreshTokensRequest = {
  refreshToken: string;
};

export type RefreshTokensResponse = ServiceResponse<{
  id: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  ipAddress: string;
  userID: string;
  createdAt: Date;
  updatedAt: Date;
}>;

export type GetTokensRequest = {
  sessionID: string;
  userID: string;
};

export type GetTokensResponse = ServiceResponse<{
  id: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  ipAddress: string;
  userID: string;
  createdAt: Date;
  updatedAt: Date;
}>;
