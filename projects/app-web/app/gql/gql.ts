/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query GetCurrentUser {\n    getCurrentUser {\n      id\n      username\n      name\n    }\n  }\n": typeof types.GetCurrentUserDocument,
    "\n  query GetWorlds($input: GetWorldsInput!) {\n    getWorlds(input: $input) {\n      id\n      name\n      updatedAt\n    }\n  }\n": typeof types.GetWorldsDocument,
    "\n  mutation StartPasswordReset($input: StartPasswordResetInput!) {\n    startPasswordReset(input: $input) {\n      ... on MutationErrorPayload {\n        error {\n          title\n          message\n        }\n      }\n\n      ... on StartPasswordResetPayload {\n        success\n      }\n    }\n  }\n": typeof types.StartPasswordResetDocument,
    "\n  mutation LoginWithPassword($input: LoginWithPasswordInput!) {\n    loginWithPassword(input: $input) {\n      ... on AuthPayload {\n        accessToken\n        refreshToken\n        session {\n          id\n          expiresAt\n        }\n      }\n\n      ... on MutationErrorPayload {\n        error {\n          title\n          message\n        }\n      }\n    }\n  }\n": typeof types.LoginWithPasswordDocument,
    "\n  mutation FinishEmailSignup($input: FinishEmailSignupInput!) {\n    finishEmailSignup(input: $input) {\n      ... on AuthPayload {\n        accessToken\n        refreshToken\n        session {\n          id\n          expiresAt\n        }\n      }\n\n      ... on MutationErrorPayload {\n        error {\n          title\n          message\n        }\n      }\n    }\n  }\n": typeof types.FinishEmailSignupDocument,
    "\n  mutation FinishPasswordReset($input: FinishPasswordResetInput!) {\n    finishPasswordReset(input: $input) {\n      ... on MutationSuccess {\n        success\n      }\n\n      ... on MutationErrorPayload {\n        error {\n          title\n          message\n        }\n      }\n    }\n  }\n": typeof types.FinishPasswordResetDocument,
    "\n  mutation StartEmailSignup($input: StartEmailSignupInput!) {\n    startEmailSignup(input: $input) {\n      ... on MutationSuccess {\n        success\n      }\n\n      ... on MutationErrorPayload {\n        error {\n          message\n        }\n      }\n    }\n  }\n": typeof types.StartEmailSignupDocument,
    "\n  mutation VerifyOTP($input: VerifyOTPInput!) {\n    verifyOTP(input: $input) {\n      ... on Verification {\n        id\n        target\n      }\n\n      ... on MutationErrorPayload {\n        error {\n          message\n        }\n      }\n    }\n  }\n": typeof types.VerifyOtpDocument,
    "\n  query GetCreatedWorld($input: GetWorldInput!) {\n    getWorld(input: $input) {\n      id\n      name\n      fantasyType\n      technologyLevel\n      archetype\n      population\n      geographyType\n      geographyFeatures\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.GetCreatedWorldDocument,
    "\n  mutation CreateWorld($input: CreateWorldInput!) {\n    createWorld(input: $input) {\n      ... on World {\n        id\n      }\n\n      ... on MutationErrorPayload {\n        error {\n          title\n          message\n        }\n      }\n    }\n  }\n": typeof types.CreateWorldDocument,
    "\n  mutation DeleteWorld($input: DeleteWorldInput!) {\n    deleteWorld(input: $input) {\n      ... on MutationSuccess {\n        success\n      }\n\n      ... on MutationErrorPayload {\n        error {\n          title\n          message\n        }\n      }\n    }\n  }\n": typeof types.DeleteWorldDocument,
    "\n  mutation DeleteSession($input: DeleteSessionInput!) {\n    deleteSession(input: $input) {\n      ... on MutationSuccess {\n        success\n      }\n\n      ... on MutationErrorPayload {\n        error {\n          title\n          message\n        }\n      }\n    }\n  }\n": typeof types.DeleteSessionDocument,
    "\n  mutation RefreshAccessToken($input: RefreshAccessTokenInput!) {\n    refreshAccessToken(input: $input) {\n      ... on AuthPayload {\n        accessToken\n        refreshToken\n        session {\n          id\n        }\n      }\n\n      ... on MutationErrorPayload {\n        error {\n          title\n          message\n        }\n      }\n    }\n  }\n": typeof types.RefreshAccessTokenDocument,
};
const documents: Documents = {
    "\n  query GetCurrentUser {\n    getCurrentUser {\n      id\n      username\n      name\n    }\n  }\n": types.GetCurrentUserDocument,
    "\n  query GetWorlds($input: GetWorldsInput!) {\n    getWorlds(input: $input) {\n      id\n      name\n      updatedAt\n    }\n  }\n": types.GetWorldsDocument,
    "\n  mutation StartPasswordReset($input: StartPasswordResetInput!) {\n    startPasswordReset(input: $input) {\n      ... on MutationErrorPayload {\n        error {\n          title\n          message\n        }\n      }\n\n      ... on StartPasswordResetPayload {\n        success\n      }\n    }\n  }\n": types.StartPasswordResetDocument,
    "\n  mutation LoginWithPassword($input: LoginWithPasswordInput!) {\n    loginWithPassword(input: $input) {\n      ... on AuthPayload {\n        accessToken\n        refreshToken\n        session {\n          id\n          expiresAt\n        }\n      }\n\n      ... on MutationErrorPayload {\n        error {\n          title\n          message\n        }\n      }\n    }\n  }\n": types.LoginWithPasswordDocument,
    "\n  mutation FinishEmailSignup($input: FinishEmailSignupInput!) {\n    finishEmailSignup(input: $input) {\n      ... on AuthPayload {\n        accessToken\n        refreshToken\n        session {\n          id\n          expiresAt\n        }\n      }\n\n      ... on MutationErrorPayload {\n        error {\n          title\n          message\n        }\n      }\n    }\n  }\n": types.FinishEmailSignupDocument,
    "\n  mutation FinishPasswordReset($input: FinishPasswordResetInput!) {\n    finishPasswordReset(input: $input) {\n      ... on MutationSuccess {\n        success\n      }\n\n      ... on MutationErrorPayload {\n        error {\n          title\n          message\n        }\n      }\n    }\n  }\n": types.FinishPasswordResetDocument,
    "\n  mutation StartEmailSignup($input: StartEmailSignupInput!) {\n    startEmailSignup(input: $input) {\n      ... on MutationSuccess {\n        success\n      }\n\n      ... on MutationErrorPayload {\n        error {\n          message\n        }\n      }\n    }\n  }\n": types.StartEmailSignupDocument,
    "\n  mutation VerifyOTP($input: VerifyOTPInput!) {\n    verifyOTP(input: $input) {\n      ... on Verification {\n        id\n        target\n      }\n\n      ... on MutationErrorPayload {\n        error {\n          message\n        }\n      }\n    }\n  }\n": types.VerifyOtpDocument,
    "\n  query GetCreatedWorld($input: GetWorldInput!) {\n    getWorld(input: $input) {\n      id\n      name\n      fantasyType\n      technologyLevel\n      archetype\n      population\n      geographyType\n      geographyFeatures\n      createdAt\n      updatedAt\n    }\n  }\n": types.GetCreatedWorldDocument,
    "\n  mutation CreateWorld($input: CreateWorldInput!) {\n    createWorld(input: $input) {\n      ... on World {\n        id\n      }\n\n      ... on MutationErrorPayload {\n        error {\n          title\n          message\n        }\n      }\n    }\n  }\n": types.CreateWorldDocument,
    "\n  mutation DeleteWorld($input: DeleteWorldInput!) {\n    deleteWorld(input: $input) {\n      ... on MutationSuccess {\n        success\n      }\n\n      ... on MutationErrorPayload {\n        error {\n          title\n          message\n        }\n      }\n    }\n  }\n": types.DeleteWorldDocument,
    "\n  mutation DeleteSession($input: DeleteSessionInput!) {\n    deleteSession(input: $input) {\n      ... on MutationSuccess {\n        success\n      }\n\n      ... on MutationErrorPayload {\n        error {\n          title\n          message\n        }\n      }\n    }\n  }\n": types.DeleteSessionDocument,
    "\n  mutation RefreshAccessToken($input: RefreshAccessTokenInput!) {\n    refreshAccessToken(input: $input) {\n      ... on AuthPayload {\n        accessToken\n        refreshToken\n        session {\n          id\n        }\n      }\n\n      ... on MutationErrorPayload {\n        error {\n          title\n          message\n        }\n      }\n    }\n  }\n": types.RefreshAccessTokenDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetCurrentUser {\n    getCurrentUser {\n      id\n      username\n      name\n    }\n  }\n"): (typeof documents)["\n  query GetCurrentUser {\n    getCurrentUser {\n      id\n      username\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetWorlds($input: GetWorldsInput!) {\n    getWorlds(input: $input) {\n      id\n      name\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  query GetWorlds($input: GetWorldsInput!) {\n    getWorlds(input: $input) {\n      id\n      name\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation StartPasswordReset($input: StartPasswordResetInput!) {\n    startPasswordReset(input: $input) {\n      ... on MutationErrorPayload {\n        error {\n          title\n          message\n        }\n      }\n\n      ... on StartPasswordResetPayload {\n        success\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation StartPasswordReset($input: StartPasswordResetInput!) {\n    startPasswordReset(input: $input) {\n      ... on MutationErrorPayload {\n        error {\n          title\n          message\n        }\n      }\n\n      ... on StartPasswordResetPayload {\n        success\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation LoginWithPassword($input: LoginWithPasswordInput!) {\n    loginWithPassword(input: $input) {\n      ... on AuthPayload {\n        accessToken\n        refreshToken\n        session {\n          id\n          expiresAt\n        }\n      }\n\n      ... on MutationErrorPayload {\n        error {\n          title\n          message\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation LoginWithPassword($input: LoginWithPasswordInput!) {\n    loginWithPassword(input: $input) {\n      ... on AuthPayload {\n        accessToken\n        refreshToken\n        session {\n          id\n          expiresAt\n        }\n      }\n\n      ... on MutationErrorPayload {\n        error {\n          title\n          message\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation FinishEmailSignup($input: FinishEmailSignupInput!) {\n    finishEmailSignup(input: $input) {\n      ... on AuthPayload {\n        accessToken\n        refreshToken\n        session {\n          id\n          expiresAt\n        }\n      }\n\n      ... on MutationErrorPayload {\n        error {\n          title\n          message\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation FinishEmailSignup($input: FinishEmailSignupInput!) {\n    finishEmailSignup(input: $input) {\n      ... on AuthPayload {\n        accessToken\n        refreshToken\n        session {\n          id\n          expiresAt\n        }\n      }\n\n      ... on MutationErrorPayload {\n        error {\n          title\n          message\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation FinishPasswordReset($input: FinishPasswordResetInput!) {\n    finishPasswordReset(input: $input) {\n      ... on MutationSuccess {\n        success\n      }\n\n      ... on MutationErrorPayload {\n        error {\n          title\n          message\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation FinishPasswordReset($input: FinishPasswordResetInput!) {\n    finishPasswordReset(input: $input) {\n      ... on MutationSuccess {\n        success\n      }\n\n      ... on MutationErrorPayload {\n        error {\n          title\n          message\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation StartEmailSignup($input: StartEmailSignupInput!) {\n    startEmailSignup(input: $input) {\n      ... on MutationSuccess {\n        success\n      }\n\n      ... on MutationErrorPayload {\n        error {\n          message\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation StartEmailSignup($input: StartEmailSignupInput!) {\n    startEmailSignup(input: $input) {\n      ... on MutationSuccess {\n        success\n      }\n\n      ... on MutationErrorPayload {\n        error {\n          message\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation VerifyOTP($input: VerifyOTPInput!) {\n    verifyOTP(input: $input) {\n      ... on Verification {\n        id\n        target\n      }\n\n      ... on MutationErrorPayload {\n        error {\n          message\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation VerifyOTP($input: VerifyOTPInput!) {\n    verifyOTP(input: $input) {\n      ... on Verification {\n        id\n        target\n      }\n\n      ... on MutationErrorPayload {\n        error {\n          message\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetCreatedWorld($input: GetWorldInput!) {\n    getWorld(input: $input) {\n      id\n      name\n      fantasyType\n      technologyLevel\n      archetype\n      population\n      geographyType\n      geographyFeatures\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  query GetCreatedWorld($input: GetWorldInput!) {\n    getWorld(input: $input) {\n      id\n      name\n      fantasyType\n      technologyLevel\n      archetype\n      population\n      geographyType\n      geographyFeatures\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateWorld($input: CreateWorldInput!) {\n    createWorld(input: $input) {\n      ... on World {\n        id\n      }\n\n      ... on MutationErrorPayload {\n        error {\n          title\n          message\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateWorld($input: CreateWorldInput!) {\n    createWorld(input: $input) {\n      ... on World {\n        id\n      }\n\n      ... on MutationErrorPayload {\n        error {\n          title\n          message\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteWorld($input: DeleteWorldInput!) {\n    deleteWorld(input: $input) {\n      ... on MutationSuccess {\n        success\n      }\n\n      ... on MutationErrorPayload {\n        error {\n          title\n          message\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteWorld($input: DeleteWorldInput!) {\n    deleteWorld(input: $input) {\n      ... on MutationSuccess {\n        success\n      }\n\n      ... on MutationErrorPayload {\n        error {\n          title\n          message\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteSession($input: DeleteSessionInput!) {\n    deleteSession(input: $input) {\n      ... on MutationSuccess {\n        success\n      }\n\n      ... on MutationErrorPayload {\n        error {\n          title\n          message\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteSession($input: DeleteSessionInput!) {\n    deleteSession(input: $input) {\n      ... on MutationSuccess {\n        success\n      }\n\n      ... on MutationErrorPayload {\n        error {\n          title\n          message\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RefreshAccessToken($input: RefreshAccessTokenInput!) {\n    refreshAccessToken(input: $input) {\n      ... on AuthPayload {\n        accessToken\n        refreshToken\n        session {\n          id\n        }\n      }\n\n      ... on MutationErrorPayload {\n        error {\n          title\n          message\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation RefreshAccessToken($input: RefreshAccessTokenInput!) {\n    refreshAccessToken(input: $input) {\n      ... on AuthPayload {\n        accessToken\n        refreshToken\n        session {\n          id\n        }\n      }\n\n      ... on MutationErrorPayload {\n        error {\n          title\n          message\n        }\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;