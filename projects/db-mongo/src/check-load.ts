import fs from 'node:fs/promises';
import os from 'node:os';
import { CheckFailure } from './consts';

export async function checkLoad(): Promise<string | typeof CheckFailure> {
  try {
    const raw = await fs.readFile('/proc/loadavg', 'utf8');
    const parts = raw.split(' ');

    const [avg1 = '0', avg5 = '0', avg10 = '0'] = parts;

    const loadAverage1 = Number.parseFloat(avg1);
    const loadAverage5 = Number.parseFloat(avg5);
    const loadAverage10 = Number.parseFloat(avg10);

    const cpus = os.cpus().length;

    if (loadAverage1 / cpus > 10) {
      return CheckFailure;
    }

    if (loadAverage5 / cpus > 4) {
      return CheckFailure;
    }

    if (loadAverage10 / cpus > 2) {
      return CheckFailure;
    }

    return `${loadAverage10.toFixed(2)} ${loadAverage5.toFixed(2)} ${loadAverage1.toFixed(2)}`;
  } catch {
    return CheckFailure;
  }
}
