import type { Context } from 'hono';
import { checkDiskUsage } from './check-disk-usage';
import { checkLoad } from './check-load';
import { checkPressure } from './check-pressure';
import { createChecks } from './create-checks';

export async function handleVMCheck(c: Context) {
  const checks = createChecks();

  const disk = await checkDiskUsage('/data/');
  const load = await checkLoad();
  const memoryPressure = await checkPressure('memory');
  const cpuPressure = await checkPressure('cpu');
  const ioPressure = await checkPressure('io');

  checks.addCheck('disk', disk);
  checks.addCheck('load', load);
  checks.addCheck('memoryPressure', memoryPressure);
  checks.addCheck('cpuPressure', cpuPressure);
  checks.addCheck('ioPressure', ioPressure);

  return c.json(...checks.createResponse());
}
