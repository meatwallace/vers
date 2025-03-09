import { Context } from '../types';

interface Authed {
  user: NonNullable<Context['user']>;
}

interface MaybeAuthed {
  user: Context['user'];
  session: Context['session'];
}

export function isAuthed<T extends MaybeAuthed>(ctx: T): ctx is T & Authed {
  return Boolean(ctx.user && ctx.session);
}
