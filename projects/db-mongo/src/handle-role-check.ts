import type { Context } from 'hono';
import { checkReplicaSetRole } from './check-replica-set-role';
import { createChecks } from './create-checks';

export async function handleRoleCheck(c: Context) {
  const checks = createChecks();

  const role = await checkReplicaSetRole();

  checks.addCheck('role', role);

  return c.json(...checks.createResponse());
}
