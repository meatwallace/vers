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
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
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

export type CreateWorldInput = {
  placeholder?: InputMaybe<Scalars['String']['input']>;
};

export type CreateWorldPayload = MutationErrorPayload | World;

export type DeleteSessionInput = {
  id: Scalars['String']['input'];
};

export type DeleteSessionPayload = MutationErrorPayload | MutationSuccess;

export type DeleteWorldInput = {
  worldID: Scalars['String']['input'];
};

export type DeleteWorldPayload = MutationErrorPayload | MutationSuccess;

export type FinishEmailSignupInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  rememberMe: Scalars['Boolean']['input'];
  username: Scalars['String']['input'];
};

export type FinishEmailSignupPayload = AuthPayload | MutationErrorPayload;

export type GenerateWorldNamesInput = {
  worldID: Scalars['String']['input'];
};

export type GetSessionsInput = {
  placeholder?: InputMaybe<Scalars['String']['input']>;
};

export type GetWorldInput = {
  worldID: Scalars['String']['input'];
};

export type GetWorldsInput = {
  placeholder?: InputMaybe<Scalars['String']['input']>;
};

export type LoginWithPasswordInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  rememberMe: Scalars['Boolean']['input'];
};

export type LoginWithPasswordPayload = AuthPayload | MutationErrorPayload;

export type Mutation = {
  __typename?: 'Mutation';
  createWorld: CreateWorldPayload;
  deleteSession: DeleteSessionPayload;
  deleteWorld: DeleteWorldPayload;
  finishEmailSignup: FinishEmailSignupPayload;
  loginWithPassword: LoginWithPasswordPayload;
  refreshAccessToken: RefreshAccessTokenPayload;
  startEmailSignup: StartEmailSignupPayload;
  updateWorld: UpdateWorldPayload;
  verifyOTP: VerifyOtpPayload;
};


export type MutationCreateWorldArgs = {
  input: CreateWorldInput;
};


export type MutationDeleteSessionArgs = {
  input: DeleteSessionInput;
};


export type MutationDeleteWorldArgs = {
  input: DeleteWorldInput;
};


export type MutationFinishEmailSignupArgs = {
  input: FinishEmailSignupInput;
};


export type MutationLoginWithPasswordArgs = {
  input: LoginWithPasswordInput;
};


export type MutationRefreshAccessTokenArgs = {
  input: RefreshAccessTokenInput;
};


export type MutationStartEmailSignupArgs = {
  input: StartEmailSignupInput;
};


export type MutationUpdateWorldArgs = {
  input: UpdateWorldInput;
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
  generateWorldNames: Array<Scalars['String']['output']>;
  getCurrentUser: User;
  getSessions: Array<Session>;
  getWorld: World;
  getWorlds: Array<World>;
};


export type QueryGenerateWorldNamesArgs = {
  input: GenerateWorldNamesInput;
};


export type QueryGetSessionsArgs = {
  input: GetSessionsInput;
};


export type QueryGetWorldArgs = {
  input: GetWorldInput;
};


export type QueryGetWorldsArgs = {
  input: GetWorldsInput;
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

export type StartEmailSignupInput = {
  email: Scalars['String']['input'];
};

export type StartEmailSignupPayload = MutationErrorPayload | MutationSuccess;

export type UpdateWorldInput = {
  archetype?: InputMaybe<Scalars['String']['input']>;
  atmosphere?: InputMaybe<Scalars['String']['input']>;
  fantasyType?: InputMaybe<Scalars['String']['input']>;
  geographyFeatures?: InputMaybe<Array<Scalars['String']['input']>>;
  geographyType?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  population?: InputMaybe<Scalars['String']['input']>;
  technologyLevel?: InputMaybe<Scalars['String']['input']>;
  worldID: Scalars['String']['input'];
};

export type UpdateWorldPayload = MutationErrorPayload | World;

export type User = {
  __typename?: 'User';
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  username: Scalars['String']['output'];
};

export type Verification = {
  __typename?: 'Verification';
  id: Scalars['ID']['output'];
  target: Scalars['String']['output'];
};

export enum VerificationType {
  ChangeEmail = 'CHANGE_EMAIL',
  Onboarding = 'ONBOARDING',
  ResetPassword = 'RESET_PASSWORD',
  TwoFactorAuth = 'TWO_FACTOR_AUTH'
}

export type VerifyOtpInput = {
  code: Scalars['String']['input'];
  target: Scalars['String']['input'];
  type: VerificationType;
};

export type VerifyOtpPayload = MutationErrorPayload | Verification;

export type World = {
  __typename?: 'World';
  archetype?: Maybe<Scalars['String']['output']>;
  atmosphere: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  fantasyType: Scalars['String']['output'];
  geographyFeatures: Array<Scalars['String']['output']>;
  geographyType: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  population: Scalars['String']['output'];
  technologyLevel: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type GetCurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentUserQuery = { __typename?: 'Query', getCurrentUser: { __typename?: 'User', id: string, username: string, name: string } };

export type GetWorldsQueryVariables = Exact<{
  input: GetWorldsInput;
}>;


export type GetWorldsQuery = { __typename?: 'Query', getWorlds: Array<{ __typename?: 'World', id: string, name: string, updatedAt: string }> };

export type LoginWithPasswordMutationVariables = Exact<{
  input: LoginWithPasswordInput;
}>;


export type LoginWithPasswordMutation = { __typename?: 'Mutation', loginWithPassword: { __typename?: 'AuthPayload', accessToken: string, refreshToken: string, session: { __typename?: 'Session', id: string, expiresAt: string } } | { __typename?: 'MutationErrorPayload', error: { __typename?: 'MutationError', title: string, message: string } } };

export type FinishEmailSignupMutationVariables = Exact<{
  input: FinishEmailSignupInput;
}>;


export type FinishEmailSignupMutation = { __typename?: 'Mutation', finishEmailSignup: { __typename?: 'AuthPayload', accessToken: string, refreshToken: string, session: { __typename?: 'Session', id: string, expiresAt: string } } | { __typename?: 'MutationErrorPayload', error: { __typename?: 'MutationError', title: string, message: string } } };

export type StartEmailSignupMutationVariables = Exact<{
  input: StartEmailSignupInput;
}>;


export type StartEmailSignupMutation = { __typename?: 'Mutation', startEmailSignup: { __typename?: 'MutationErrorPayload', error: { __typename?: 'MutationError', message: string } } | { __typename?: 'MutationSuccess', success: boolean } };

export type VerifyOtpMutationVariables = Exact<{
  input: VerifyOtpInput;
}>;


export type VerifyOtpMutation = { __typename?: 'Mutation', verifyOTP: { __typename?: 'MutationErrorPayload', error: { __typename?: 'MutationError', message: string } } | { __typename?: 'Verification', id: string, target: string } };

export type GetCreatedWorldQueryVariables = Exact<{
  input: GetWorldInput;
}>;


export type GetCreatedWorldQuery = { __typename?: 'Query', getWorld: { __typename?: 'World', id: string, name: string, fantasyType: string, technologyLevel: string, archetype?: string | null, population: string, geographyType: string, geographyFeatures: Array<string>, createdAt: string, updatedAt: string } };

export type CreateWorldMutationVariables = Exact<{
  input: CreateWorldInput;
}>;


export type CreateWorldMutation = { __typename?: 'Mutation', createWorld: { __typename?: 'MutationErrorPayload', error: { __typename?: 'MutationError', title: string, message: string } } | { __typename?: 'World', id: string } };

export type DeleteWorldMutationVariables = Exact<{
  input: DeleteWorldInput;
}>;


export type DeleteWorldMutation = { __typename?: 'Mutation', deleteWorld: { __typename?: 'MutationErrorPayload', error: { __typename?: 'MutationError', title: string, message: string } } | { __typename?: 'MutationSuccess', success: boolean } };

export type DeleteSessionMutationVariables = Exact<{
  input: DeleteSessionInput;
}>;


export type DeleteSessionMutation = { __typename?: 'Mutation', deleteSession: { __typename?: 'MutationErrorPayload', error: { __typename?: 'MutationError', title: string, message: string } } | { __typename?: 'MutationSuccess', success: boolean } };

export type RefreshAccessTokenMutationVariables = Exact<{
  input: RefreshAccessTokenInput;
}>;


export type RefreshAccessTokenMutation = { __typename?: 'Mutation', refreshAccessToken: { __typename?: 'AuthPayload', accessToken: string, refreshToken: string, session: { __typename?: 'Session', id: string } } | { __typename?: 'MutationErrorPayload', error: { __typename?: 'MutationError', title: string, message: string } } };


export const GetCurrentUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCurrentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCurrentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetCurrentUserQuery, GetCurrentUserQueryVariables>;
export const GetWorldsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetWorlds"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetWorldsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getWorlds"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetWorldsQuery, GetWorldsQueryVariables>;
export const LoginWithPasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LoginWithPassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginWithPasswordInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"loginWithPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AuthPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}},{"kind":"Field","name":{"kind":"Name","value":"session"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MutationErrorPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<LoginWithPasswordMutation, LoginWithPasswordMutationVariables>;
export const FinishEmailSignupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"FinishEmailSignup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FinishEmailSignupInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"finishEmailSignup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AuthPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}},{"kind":"Field","name":{"kind":"Name","value":"session"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MutationErrorPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<FinishEmailSignupMutation, FinishEmailSignupMutationVariables>;
export const StartEmailSignupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"StartEmailSignup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StartEmailSignupInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startEmailSignup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MutationSuccess"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MutationErrorPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<StartEmailSignupMutation, StartEmailSignupMutationVariables>;
export const VerifyOtpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"VerifyOTP"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"VerifyOTPInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verifyOTP"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Verification"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"target"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MutationErrorPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<VerifyOtpMutation, VerifyOtpMutationVariables>;
export const GetCreatedWorldDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCreatedWorld"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetWorldInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getWorld"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"fantasyType"}},{"kind":"Field","name":{"kind":"Name","value":"technologyLevel"}},{"kind":"Field","name":{"kind":"Name","value":"archetype"}},{"kind":"Field","name":{"kind":"Name","value":"population"}},{"kind":"Field","name":{"kind":"Name","value":"geographyType"}},{"kind":"Field","name":{"kind":"Name","value":"geographyFeatures"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetCreatedWorldQuery, GetCreatedWorldQueryVariables>;
export const CreateWorldDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateWorld"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateWorldInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createWorld"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"World"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MutationErrorPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateWorldMutation, CreateWorldMutationVariables>;
export const DeleteWorldDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteWorld"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteWorldInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteWorld"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MutationSuccess"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MutationErrorPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<DeleteWorldMutation, DeleteWorldMutationVariables>;
export const DeleteSessionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteSession"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteSessionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteSession"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MutationSuccess"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MutationErrorPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<DeleteSessionMutation, DeleteSessionMutationVariables>;
export const RefreshAccessTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RefreshAccessToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RefreshAccessTokenInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refreshAccessToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AuthPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}},{"kind":"Field","name":{"kind":"Name","value":"session"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MutationErrorPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<RefreshAccessTokenMutation, RefreshAccessTokenMutationVariables>;