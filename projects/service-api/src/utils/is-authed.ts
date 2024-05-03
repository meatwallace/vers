import { Context } from '../types';

type Authed = {
  user: NonNullable<Context['user']>;
};

type MaybeAuthed = {
  user: Context['user'];
};

export function isAuthed<T extends MaybeAuthed>(ctx: T): ctx is T & Authed {
  return Boolean(ctx.user);
}
