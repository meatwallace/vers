import { builder } from '../builder';

builder.queryFields((t) => ({
  hello: t.string({
    args: {
      name: t.arg.string(),
    },
    resolve,
  }),
}));

type Args = {
  name?: string | null;
};

export function resolve(_: object, args: Args) {
  return `hello, ${args.name || 'world'}`;
}
