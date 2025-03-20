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

export type CreateSessionPayload = AuthPayload;

export type DeleteSessionPayload = Record<string, never>;

export type GetSessionPayload = null | SessionData;

export type GetSessionsPayload = Array<SessionData>;

export type RefreshTokensPayload = AuthPayload;
