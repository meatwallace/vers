/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  /** The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID. */
  ID: { input: string; output: string; }
  /** The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text. */
  String: { input: string; output: string; }
  /** The `Boolean` scalar type represents `true` or `false`. */
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date string, such as 2007-12-03, compliant with the `full-date` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  Date: { input: Date; output: string; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: { input: Date; output: string; }
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  accessToken: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
  session: Session;
};

export type DeleteSessionInput = {
  id: Scalars['String']['input'];
};

export type DeleteSessionPayload = MutationErrorPayload | MutationSuccess;

export type FinishDisable2FaInput = {
  transactionToken: Scalars['String']['input'];
};

export type FinishDisable2FaPayload = MutationErrorPayload | MutationSuccess;

export type FinishEmailSignupInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  rememberMe: Scalars['Boolean']['input'];
  transactionToken: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type FinishEmailSignupPayload = AuthPayload | MutationErrorPayload;

export type FinishEnable2FaInput = {
  transactionToken: Scalars['String']['input'];
};

export type FinishEnable2FaPayload = MutationErrorPayload | MutationSuccess;

export type FinishLoginWith2FaInput = {
  target: Scalars['String']['input'];
  transactionToken: Scalars['String']['input'];
};

export type FinishLoginWith2FaPayload = AuthPayload | MutationErrorPayload;

export type FinishPasswordResetInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  resetToken: Scalars['String']['input'];
  transactionToken?: InputMaybe<Scalars['String']['input']>;
};

export type FinishPasswordResetPayload = MutationErrorPayload | MutationSuccess;

export type GetSessionsInput = {
  placeholder?: InputMaybe<Scalars['String']['input']>;
};

export type LoginWithPasswordInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  rememberMe: Scalars['Boolean']['input'];
};

export type LoginWithPasswordPayload = AuthPayload | MutationErrorPayload | TwoFactorRequiredPayload;

export type Mutation = {
  __typename?: 'Mutation';
  deleteSession: DeleteSessionPayload;
  finishDisable2FA: FinishDisable2FaPayload;
  finishEmailSignup: FinishEmailSignupPayload;
  finishEnable2FA: FinishEnable2FaPayload;
  finishLoginWith2FA: FinishLoginWith2FaPayload;
  finishPasswordReset: FinishPasswordResetPayload;
  loginWithPassword: LoginWithPasswordPayload;
  refreshAccessToken: RefreshAccessTokenPayload;
  startDisable2FA: StartDisable2FaPayload;
  startEmailSignup: StartEmailSignupPayload;
  startEnable2FA: StartEnable2FaPayload;
  startPasswordReset: StartPasswordResetPayload;
  verifyOTP: VerifyOtpPayload;
};


export type MutationDeleteSessionArgs = {
  input: DeleteSessionInput;
};


export type MutationFinishDisable2FaArgs = {
  input: FinishDisable2FaInput;
};


export type MutationFinishEmailSignupArgs = {
  input: FinishEmailSignupInput;
};


export type MutationFinishEnable2FaArgs = {
  input: FinishEnable2FaInput;
};


export type MutationFinishLoginWith2FaArgs = {
  input: FinishLoginWith2FaInput;
};


export type MutationFinishPasswordResetArgs = {
  input: FinishPasswordResetInput;
};


export type MutationLoginWithPasswordArgs = {
  input: LoginWithPasswordInput;
};


export type MutationRefreshAccessTokenArgs = {
  input: RefreshAccessTokenInput;
};


export type MutationStartDisable2FaArgs = {
  input: StartDisable2FaInput;
};


export type MutationStartEmailSignupArgs = {
  input: StartEmailSignupInput;
};


export type MutationStartEnable2FaArgs = {
  input: StartEnable2FaInput;
};


export type MutationStartPasswordResetArgs = {
  input: StartPasswordResetInput;
};


export type MutationVerifyOtpArgs = {
  input: VerifyOtpInput;
};

export type MutationError = {
  __typename?: 'MutationError';
  message: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type MutationErrorPayload = {
  __typename?: 'MutationErrorPayload';
  error: MutationError;
};

export type MutationSuccess = {
  __typename?: 'MutationSuccess';
  success: Scalars['Boolean']['output'];
};

export type Query = {
  __typename?: 'Query';
  getCurrentUser: User;
  getEnable2FAVerification: TwoFactorVerification;
  getSessions: Array<Session>;
};


export type QueryGetSessionsArgs = {
  input: GetSessionsInput;
};

export type RefreshAccessTokenInput = {
  refreshToken: Scalars['String']['input'];
};

export type RefreshAccessTokenPayload = AuthPayload | MutationErrorPayload;

export type Session = {
  __typename?: 'Session';
  createdAt: Scalars['DateTime']['output'];
  expiresAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  user: User;
};

export type StartDisable2FaInput = {
  placeholder?: InputMaybe<Scalars['String']['input']>;
};

export type StartDisable2FaPayload = MutationErrorPayload | TwoFactorRequiredPayload;

export type StartEmailSignupInput = {
  email: Scalars['String']['input'];
};

export type StartEmailSignupPayload = MutationErrorPayload | TwoFactorRequiredPayload;

export type StartEnable2FaInput = {
  placeholder?: InputMaybe<Scalars['String']['input']>;
};

export type StartEnable2FaPayload = MutationErrorPayload | TwoFactorRequiredPayload;

export type StartPasswordResetInput = {
  email: Scalars['String']['input'];
};

export type StartPasswordResetPayload = MutationErrorPayload | MutationSuccess | TwoFactorRequiredPayload;

export type TwoFactorRequiredPayload = {
  __typename?: 'TwoFactorRequiredPayload';
  sessionID?: Maybe<Scalars['String']['output']>;
  transactionID: Scalars['String']['output'];
};

export type TwoFactorSuccessPayload = {
  __typename?: 'TwoFactorSuccessPayload';
  transactionToken: Scalars['String']['output'];
};

export type TwoFactorVerification = {
  __typename?: 'TwoFactorVerification';
  otpURI: Scalars['String']['output'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  is2FAEnabled: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  username: Scalars['String']['output'];
};

export enum VerificationType {
  ChangeEmail = 'CHANGE_EMAIL',
  ChangeEmailConfirmation = 'CHANGE_EMAIL_CONFIRMATION',
  ChangePassword = 'CHANGE_PASSWORD',
  Onboarding = 'ONBOARDING',
  ResetPassword = 'RESET_PASSWORD',
  TwoFactorAuth = 'TWO_FACTOR_AUTH',
  TwoFactorAuthDisable = 'TWO_FACTOR_AUTH_DISABLE',
  TwoFactorAuthSetup = 'TWO_FACTOR_AUTH_SETUP'
}

export type VerifyOtpInput = {
  code: Scalars['String']['input'];
  sessionID?: InputMaybe<Scalars['String']['input']>;
  target: Scalars['String']['input'];
  transactionID: Scalars['String']['input'];
  type: VerificationType;
};

export type VerifyOtpPayload = MutationErrorPayload | TwoFactorSuccessPayload;

export type VerifyOtpMutationVariables = Exact<{
  input: VerifyOtpInput;
}>;


export type VerifyOtpMutation = { __typename?: 'Mutation', verifyOTP: { __typename?: 'MutationErrorPayload', error: { __typename?: 'MutationError', title: string, message: string } } | { __typename?: 'TwoFactorSuccessPayload', transactionToken: string } };

export type GetCurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentUserQuery = { __typename?: 'Query', getCurrentUser: { __typename?: 'User', id: string, username: string, name: string, email: string, is2FAEnabled: boolean } };

export type StartPasswordResetMutationVariables = Exact<{
  input: StartPasswordResetInput;
}>;


export type StartPasswordResetMutation = { __typename?: 'Mutation', startPasswordReset: { __typename?: 'MutationErrorPayload', error: { __typename?: 'MutationError', title: string, message: string } } | { __typename?: 'MutationSuccess', success: boolean } | { __typename?: 'TwoFactorRequiredPayload', transactionID: string } };

export type LoginWithPasswordMutationVariables = Exact<{
  input: LoginWithPasswordInput;
}>;


export type LoginWithPasswordMutation = { __typename?: 'Mutation', loginWithPassword: { __typename?: 'AuthPayload', accessToken: string, refreshToken: string, session: { __typename?: 'Session', id: string, expiresAt: string } } | { __typename?: 'MutationErrorPayload', error: { __typename?: 'MutationError', title: string, message: string } } | { __typename?: 'TwoFactorRequiredPayload', transactionID: string, sessionID?: string | null } };

export type FinishEmailSignupMutationVariables = Exact<{
  input: FinishEmailSignupInput;
}>;


export type FinishEmailSignupMutation = { __typename?: 'Mutation', finishEmailSignup: { __typename?: 'AuthPayload', accessToken: string, refreshToken: string, session: { __typename?: 'Session', id: string, expiresAt: string } } | { __typename?: 'MutationErrorPayload', error: { __typename?: 'MutationError', title: string, message: string } } };

export type StartEnable2FaMutationVariables = Exact<{
  input: StartEnable2FaInput;
}>;


export type StartEnable2FaMutation = { __typename?: 'Mutation', startEnable2FA: { __typename?: 'MutationErrorPayload', error: { __typename?: 'MutationError', title: string, message: string } } | { __typename?: 'TwoFactorRequiredPayload', transactionID: string } };

export type StartDisable2FaMutationVariables = Exact<{
  input: StartDisable2FaInput;
}>;


export type StartDisable2FaMutation = { __typename?: 'Mutation', startDisable2FA: { __typename?: 'MutationErrorPayload', error: { __typename?: 'MutationError', title: string, message: string } } | { __typename?: 'TwoFactorRequiredPayload', transactionID: string } };

export type GetEnable2FaVerificationQueryVariables = Exact<{ [key: string]: never; }>;


export type GetEnable2FaVerificationQuery = { __typename?: 'Query', getEnable2FAVerification: { __typename?: 'TwoFactorVerification', otpURI: string } };

export type FinishEnable2FaMutationVariables = Exact<{
  input: FinishEnable2FaInput;
}>;


export type FinishEnable2FaMutation = { __typename?: 'Mutation', finishEnable2FA: { __typename?: 'MutationErrorPayload', error: { __typename?: 'MutationError', title: string, message: string } } | { __typename?: 'MutationSuccess', success: boolean } };

export type FinishPasswordResetMutationVariables = Exact<{
  input: FinishPasswordResetInput;
}>;


export type FinishPasswordResetMutation = { __typename?: 'Mutation', finishPasswordReset: { __typename?: 'MutationErrorPayload', error: { __typename?: 'MutationError', title: string, message: string } } | { __typename?: 'MutationSuccess', success: boolean } };

export type StartEmailSignupMutationVariables = Exact<{
  input: StartEmailSignupInput;
}>;


export type StartEmailSignupMutation = { __typename?: 'Mutation', startEmailSignup: { __typename?: 'MutationErrorPayload', error: { __typename?: 'MutationError', title: string, message: string } } | { __typename?: 'TwoFactorRequiredPayload', transactionID: string } };

export type FinishDisable2FaMutationVariables = Exact<{
  input: FinishDisable2FaInput;
}>;


export type FinishDisable2FaMutation = { __typename?: 'Mutation', finishDisable2FA: { __typename?: 'MutationErrorPayload', error: { __typename?: 'MutationError', title: string, message: string } } | { __typename?: 'MutationSuccess', success: boolean } };

export type FinishLoginWith2FaMutationVariables = Exact<{
  input: FinishLoginWith2FaInput;
}>;


export type FinishLoginWith2FaMutation = { __typename?: 'Mutation', finishLoginWith2FA: { __typename?: 'AuthPayload', accessToken: string, refreshToken: string, session: { __typename?: 'Session', id: string, expiresAt: string } } | { __typename?: 'MutationErrorPayload', error: { __typename?: 'MutationError', title: string, message: string } } };

export type DeleteSessionMutationVariables = Exact<{
  input: DeleteSessionInput;
}>;


export type DeleteSessionMutation = { __typename?: 'Mutation', deleteSession: { __typename?: 'MutationErrorPayload', error: { __typename?: 'MutationError', title: string, message: string } } | { __typename?: 'MutationSuccess', success: boolean } };

export type RefreshAccessTokenMutationVariables = Exact<{
  input: RefreshAccessTokenInput;
}>;


export type RefreshAccessTokenMutation = { __typename?: 'Mutation', refreshAccessToken: { __typename?: 'AuthPayload', accessToken: string, refreshToken: string, session: { __typename?: 'Session', id: string } } | { __typename?: 'MutationErrorPayload', error: { __typename?: 'MutationError', title: string, message: string } } };


export const VerifyOtpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"VerifyOTP"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"VerifyOTPInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verifyOTP"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TwoFactorSuccessPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"transactionToken"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MutationErrorPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<VerifyOtpMutation, VerifyOtpMutationVariables>;
export const GetCurrentUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCurrentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCurrentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"is2FAEnabled"}}]}}]}}]} as unknown as DocumentNode<GetCurrentUserQuery, GetCurrentUserQueryVariables>;
export const StartPasswordResetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"StartPasswordReset"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StartPasswordResetInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startPasswordReset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MutationSuccess"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TwoFactorRequiredPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"transactionID"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MutationErrorPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<StartPasswordResetMutation, StartPasswordResetMutationVariables>;
export const LoginWithPasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LoginWithPassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginWithPasswordInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"loginWithPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AuthPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}},{"kind":"Field","name":{"kind":"Name","value":"session"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TwoFactorRequiredPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"transactionID"}},{"kind":"Field","name":{"kind":"Name","value":"sessionID"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MutationErrorPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<LoginWithPasswordMutation, LoginWithPasswordMutationVariables>;
export const FinishEmailSignupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"FinishEmailSignup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FinishEmailSignupInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"finishEmailSignup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AuthPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}},{"kind":"Field","name":{"kind":"Name","value":"session"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MutationErrorPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<FinishEmailSignupMutation, FinishEmailSignupMutationVariables>;
export const StartEnable2FaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"StartEnable2FA"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StartEnable2FAInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startEnable2FA"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TwoFactorRequiredPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"transactionID"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MutationErrorPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<StartEnable2FaMutation, StartEnable2FaMutationVariables>;
export const StartDisable2FaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"StartDisable2FA"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StartDisable2FAInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startDisable2FA"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TwoFactorRequiredPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"transactionID"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MutationErrorPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<StartDisable2FaMutation, StartDisable2FaMutationVariables>;
export const GetEnable2FaVerificationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEnable2FAVerification"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getEnable2FAVerification"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"otpURI"}}]}}]}}]} as unknown as DocumentNode<GetEnable2FaVerificationQuery, GetEnable2FaVerificationQueryVariables>;
export const FinishEnable2FaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"FinishEnable2FA"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FinishEnable2FAInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"finishEnable2FA"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MutationSuccess"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MutationErrorPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<FinishEnable2FaMutation, FinishEnable2FaMutationVariables>;
export const FinishPasswordResetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"FinishPasswordReset"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FinishPasswordResetInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"finishPasswordReset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MutationSuccess"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MutationErrorPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<FinishPasswordResetMutation, FinishPasswordResetMutationVariables>;
export const StartEmailSignupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"StartEmailSignup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StartEmailSignupInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startEmailSignup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TwoFactorRequiredPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"transactionID"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MutationErrorPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<StartEmailSignupMutation, StartEmailSignupMutationVariables>;
export const FinishDisable2FaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"FinishDisable2FA"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FinishDisable2FAInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"finishDisable2FA"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MutationSuccess"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MutationErrorPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<FinishDisable2FaMutation, FinishDisable2FaMutationVariables>;
export const FinishLoginWith2FaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"FinishLoginWith2FA"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FinishLoginWith2FAInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"finishLoginWith2FA"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AuthPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}},{"kind":"Field","name":{"kind":"Name","value":"session"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MutationErrorPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<FinishLoginWith2FaMutation, FinishLoginWith2FaMutationVariables>;
export const DeleteSessionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteSession"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteSessionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteSession"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MutationSuccess"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MutationErrorPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<DeleteSessionMutation, DeleteSessionMutationVariables>;
export const RefreshAccessTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RefreshAccessToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RefreshAccessTokenInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refreshAccessToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AuthPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}},{"kind":"Field","name":{"kind":"Name","value":"session"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MutationErrorPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<RefreshAccessTokenMutation, RefreshAccessTokenMutationVariables>;