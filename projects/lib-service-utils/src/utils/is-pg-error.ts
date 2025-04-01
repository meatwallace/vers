import * as pg from 'postgres';

export function isPGError(error: unknown): error is pg.PostgresError {
  return error instanceof pg.PostgresError;
}
