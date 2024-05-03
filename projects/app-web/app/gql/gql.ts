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
const documents = {
    "\n  mutation GetOrCreateUser($input: GetOrCreateUserInput!) {\n    getOrCreateUser(input: $input) {\n      ... on User {\n        id\n        name\n        firstName\n        email\n        emailVerified\n        createdAt\n      }\n\n      ... on MutationErrorPayload {\n        error {\n          title\n          message\n        }\n      }\n    }\n  }\n": types.GetOrCreateUserDocument,
    "\n  query GetCurrentUser {\n    getCurrentUser {\n      id\n      name\n      firstName\n    }\n  }\n": types.GetCurrentUserDocument,
    "\n  query GetWorlds($input: GetWorldsInput!) {\n    getWorlds(input: $input) {\n      id\n      name\n      updatedAt\n    }\n  }\n": types.GetWorldsDocument,
    "\n  query GetCreatedWorld($input: GetWorldInput!) {\n    getWorld(input: $input) {\n      id\n      name\n      fantasyType\n      technologyLevel\n      archetype\n      population\n      geographyType\n      geographyFeatures\n      createdAt\n      updatedAt\n    }\n  }\n": types.GetCreatedWorldDocument,
    "\n  mutation CreateWorld($input: CreateWorldInput!) {\n    createWorld(input: $input) {\n      ... on World {\n        id\n      }\n\n      ... on MutationErrorPayload {\n        error {\n          title\n          message\n        }\n      }\n    }\n  }\n": types.CreateWorldDocument,
    "\n  mutation DeleteWorld($input: DeleteWorldInput!) {\n    deleteWorld(input: $input) {\n      ... on DeleteWorldSuccessPayload {\n        success\n      }\n\n      ... on MutationErrorPayload {\n        error {\n          title\n          message\n        }\n      }\n    }\n  }\n": types.DeleteWorldDocument,
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
export function graphql(source: "\n  mutation GetOrCreateUser($input: GetOrCreateUserInput!) {\n    getOrCreateUser(input: $input) {\n      ... on User {\n        id\n        name\n        firstName\n        email\n        emailVerified\n        createdAt\n      }\n\n      ... on MutationErrorPayload {\n        error {\n          title\n          message\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation GetOrCreateUser($input: GetOrCreateUserInput!) {\n    getOrCreateUser(input: $input) {\n      ... on User {\n        id\n        name\n        firstName\n        email\n        emailVerified\n        createdAt\n      }\n\n      ... on MutationErrorPayload {\n        error {\n          title\n          message\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetCurrentUser {\n    getCurrentUser {\n      id\n      name\n      firstName\n    }\n  }\n"): (typeof documents)["\n  query GetCurrentUser {\n    getCurrentUser {\n      id\n      name\n      firstName\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetWorlds($input: GetWorldsInput!) {\n    getWorlds(input: $input) {\n      id\n      name\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  query GetWorlds($input: GetWorldsInput!) {\n    getWorlds(input: $input) {\n      id\n      name\n      updatedAt\n    }\n  }\n"];
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
export function graphql(source: "\n  mutation DeleteWorld($input: DeleteWorldInput!) {\n    deleteWorld(input: $input) {\n      ... on DeleteWorldSuccessPayload {\n        success\n      }\n\n      ... on MutationErrorPayload {\n        error {\n          title\n          message\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteWorld($input: DeleteWorldInput!) {\n    deleteWorld(input: $input) {\n      ... on DeleteWorldSuccessPayload {\n        success\n      }\n\n      ... on MutationErrorPayload {\n        error {\n          title\n          message\n        }\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;