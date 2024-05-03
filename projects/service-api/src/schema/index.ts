import { builder } from './builder';

export const schema = builder.toSchema();

export * from './types/mutation-error';
export * from './types/mutation-error-payload';
export * from './types/user';

export * from './mutations/get-or-create-user';

export * from './mutations/create-world';
export * from './mutations/delete-world';
export * from './mutations/update-world';

export * from './queries/get-current-user';

export * from './queries/generate-world-names';
export * from './queries/get-world';
export * from './queries/get-worlds';
