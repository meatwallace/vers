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
  Date: { input: Date; output: Date; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: { input: Date; output: Date; }
};

export type CreateWorldInput = {
  placeholder?: InputMaybe<Scalars['String']['input']>;
};

export type CreateWorldPayload = MutationErrorPayload | World;

export type DeleteWorldInput = {
  worldID: Scalars['String']['input'];
};

export type DeleteWorldPayload = DeleteWorldSuccessPayload | MutationErrorPayload;

export type DeleteWorldSuccessPayload = {
  __typename?: 'DeleteWorldSuccessPayload';
  success: Scalars['Boolean']['output'];
};

export type GenerateWorldNamesInput = {
  worldID: Scalars['String']['input'];
};

export type GetOrCreateUserInput = {
  email: Scalars['String']['input'];
};

export type GetOrCreateUserPayload = MutationErrorPayload | User;

export type GetWorldInput = {
  worldID: Scalars['String']['input'];
};

export type GetWorldsInput = {
  placeholder?: InputMaybe<Scalars['String']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createWorld: CreateWorldPayload;
  deleteWorld: DeleteWorldPayload;
  getOrCreateUser: GetOrCreateUserPayload;
  updateWorld: UpdateWorldPayload;
};


export type MutationCreateWorldArgs = {
  input: CreateWorldInput;
};


export type MutationDeleteWorldArgs = {
  input: DeleteWorldInput;
};


export type MutationGetOrCreateUserArgs = {
  input: GetOrCreateUserInput;
};


export type MutationUpdateWorldArgs = {
  input: UpdateWorldInput;
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

export type Query = {
  __typename?: 'Query';
  generateWorldNames: Array<Scalars['String']['output']>;
  getCurrentUser: User;
  getWorld: World;
  getWorlds: Array<World>;
};


export type QueryGenerateWorldNamesArgs = {
  input: GenerateWorldNamesInput;
};


export type QueryGetWorldArgs = {
  input: GetWorldInput;
};


export type QueryGetWorldsArgs = {
  input: GetWorldsInput;
};

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
  emailVerified: Scalars['Boolean']['output'];
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

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

export type GetOrCreateUserMutationVariables = Exact<{
  input: GetOrCreateUserInput;
}>;


export type GetOrCreateUserMutation = { __typename?: 'Mutation', getOrCreateUser: { __typename?: 'MutationErrorPayload', error: { __typename?: 'MutationError', title: string, message: string } } | { __typename?: 'User', id: string, name: string, firstName?: string | null, email: string, emailVerified: boolean, createdAt: Date } };

export type GetCurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentUserQuery = { __typename?: 'Query', getCurrentUser: { __typename?: 'User', id: string, name: string, firstName?: string | null } };

export type GetWorldsQueryVariables = Exact<{
  input: GetWorldsInput;
}>;


export type GetWorldsQuery = { __typename?: 'Query', getWorlds: Array<{ __typename?: 'World', id: string, name: string, updatedAt: Date }> };

export type GetCreatedWorldQueryVariables = Exact<{
  input: GetWorldInput;
}>;


export type GetCreatedWorldQuery = { __typename?: 'Query', getWorld: { __typename?: 'World', id: string, name: string, fantasyType: string, technologyLevel: string, archetype?: string | null, population: string, geographyType: string, geographyFeatures: Array<string>, createdAt: Date, updatedAt: Date } };

export type CreateWorldMutationVariables = Exact<{
  input: CreateWorldInput;
}>;


export type CreateWorldMutation = { __typename?: 'Mutation', createWorld: { __typename?: 'MutationErrorPayload', error: { __typename?: 'MutationError', title: string, message: string } } | { __typename?: 'World', id: string } };

export type DeleteWorldMutationVariables = Exact<{
  input: DeleteWorldInput;
}>;


export type DeleteWorldMutation = { __typename?: 'Mutation', deleteWorld: { __typename?: 'DeleteWorldSuccessPayload', success: boolean } | { __typename?: 'MutationErrorPayload', error: { __typename?: 'MutationError', title: string, message: string } } };


export const GetOrCreateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"GetOrCreateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetOrCreateUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getOrCreateUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"emailVerified"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MutationErrorPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetOrCreateUserMutation, GetOrCreateUserMutationVariables>;
export const GetCurrentUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCurrentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCurrentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}}]}}]}}]} as unknown as DocumentNode<GetCurrentUserQuery, GetCurrentUserQueryVariables>;
export const GetWorldsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetWorlds"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetWorldsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getWorlds"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetWorldsQuery, GetWorldsQueryVariables>;
export const GetCreatedWorldDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCreatedWorld"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetWorldInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getWorld"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"fantasyType"}},{"kind":"Field","name":{"kind":"Name","value":"technologyLevel"}},{"kind":"Field","name":{"kind":"Name","value":"archetype"}},{"kind":"Field","name":{"kind":"Name","value":"population"}},{"kind":"Field","name":{"kind":"Name","value":"geographyType"}},{"kind":"Field","name":{"kind":"Name","value":"geographyFeatures"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetCreatedWorldQuery, GetCreatedWorldQueryVariables>;
export const CreateWorldDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateWorld"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateWorldInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createWorld"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"World"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MutationErrorPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateWorldMutation, CreateWorldMutationVariables>;
export const DeleteWorldDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteWorld"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteWorldInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteWorld"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteWorldSuccessPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MutationErrorPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<DeleteWorldMutation, DeleteWorldMutationVariables>;