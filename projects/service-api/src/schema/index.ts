import { builder } from './builder';

export const schema = builder.toSchema();

export * from './types/mutation-error';
export * from './types/mutation-error-payload';
export * from './types/user';

export * from './mutations/get-or-create-user';

export * from './queries/get-current-user';
