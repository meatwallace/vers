import { Context } from '../types';
import { getTokenFromContext } from './get-token-from-context';

export function isAuthed(ctx: Context): boolean {
  return Boolean(getTokenFromContext(ctx));
}
