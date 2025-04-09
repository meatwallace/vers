export interface UserData {
  createdAt: Date;
  email: string;
  id: string;
  name: string;
  seed: number;
  updatedAt: Date;
  username: string;
}

export type CreateUserPayload = UserData;

export type GetUserPayload = null | UserData;

export interface VerifyPasswordPayload {
  success: boolean;
}

export type ResetPasswordPayload = Record<string, never>;

export interface ChangePasswordPayload {
  updatedID: string;
}

export interface CreatePasswordResetTokenPayload {
  resetToken: string;
}

export interface UpdateUserPayload {
  updatedID: string;
}

export interface UpdateEmailPayload {
  updatedID: string;
}
