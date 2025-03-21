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

// export type TokenPayload = SessionTokens & {
//   session: SessionData;
// };

export type CreateSessionPayload = SessionData;

export type DeleteSessionPayload = Record<string, never>;

export type GetSessionPayload = null | SessionData;

export type GetSessionsPayload = Array<SessionData>;

export type RefreshTokensPayload = SessionTokens;

export type VerifySessionPayload = SessionTokens;
