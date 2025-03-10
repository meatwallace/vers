export interface UserData {
  createdAt: Date;
  email: string;
  id: string;
  name: string;
  updatedAt: Date;
  username: string;
}

export interface CreateUserArgs {
  email: string;
  name: string;
  password: string;
  username: string;
}

export type CreateUserPayload = UserData;

export interface GetUserArgs {
  email?: string;
  id?: string;
}

export type GetUserPayload = null | UserData;

export interface VerifyPasswordArgs {
  email: string;
  password: string;
}

export interface VerifyPasswordPayload {
  success: boolean;
}

export interface ChangePasswordArgs {
  id: string;
  password: string;
  resetToken: string;
}

export type ChangePasswordPayload = Record<string, never>;

export interface CreatePasswordResetTokenArgs {
  id: string;
}

export interface CreatePasswordResetTokenPayload {
  resetToken: string;
}

export interface UpdateUserArgs {
  email?: string;
  id: string;
  name?: string;
  username?: string;
}

export interface UpdateUserPayload {
  updatedID: string;
}
