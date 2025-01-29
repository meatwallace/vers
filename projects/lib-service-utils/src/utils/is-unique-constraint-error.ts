import * as pg from 'postgres';

export function isUniqueConstraintError(
  error: pg.PostgresError,
  constraintName: string,
) {
  return error.code === '23505' && error.constraint_name === constraintName;
}
