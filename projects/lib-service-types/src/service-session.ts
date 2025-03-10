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

export type AuthPayload = SessionTokens & {
  session: SessionData;
};

export interface CreateSessionArgs {
  expiresAt?: Date;
  ipAddress: string;
  rememberMe?: boolean;
  userID: string;
}

export type CreateSessionPayload = AuthPayload;

export interface DeleteSessionArgs {
  id: string;
  userID: string;
}

export type DeleteSessionPayload = Record<string, never>;

export interface GetSessionArgs {
  id: string;
}

export type GetSessionPayload = null | SessionData;

export interface GetSessionsArgs {
  userID: string;
}

export type GetSessionsPayload = Array<SessionData>;

export interface RefreshTokensArgs {
  refreshToken: string;
}

export type RefreshTokensPayload = AuthPayload;
