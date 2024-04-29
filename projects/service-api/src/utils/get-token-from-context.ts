import { getTokenFromHeader } from '@chrononomicon/service-utils';
import { Context } from '../types';

export function getTokenFromContext(ctx: Context): string | null {
  const header = ctx.request.headers.get('authorization');

  if (!header) {
    return null;
  }

  const token = getTokenFromHeader(header);

  return token;
}
