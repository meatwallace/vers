import { builder } from './builder';

builder.queryType({});

export const schema = builder.toSchema();

export * from './queries/hello';
