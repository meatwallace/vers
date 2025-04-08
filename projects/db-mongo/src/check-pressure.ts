import { promises as fs } from 'node:fs';
import { CheckFailure } from './consts';

export async function checkPressure(
  name: string,
): Promise<string | typeof CheckFailure> {
  try {
    const raw = await fs.readFile(`/proc/pressure/${name}`, 'utf8');

    const match = raw.match(
      /some avg10=(\d+\.?\d*) avg60=(\d+\.?\d*) avg300=(\d+\.?\d*) total=(\d+\.?\d*)/,
    );

    if (!match) {
      return CheckFailure;
    }

    const [, avg10str = '0', avg60str = '0', avg300str = '0'] = match;

    const avg10 = Number.parseFloat(avg10str);
    const avg60 = Number.parseFloat(avg60str);
    const avg300 = Number.parseFloat(avg300str);

    const avg60Dur = pressureToDuration(avg60, 60);

    // trigger failure if pressure exceeds 10 percent
    if (avg10 > 10) {
      return CheckFailure;
    }

    if (avg60 > 10) {
      return CheckFailure;
    }

    if (avg300 > 10) {
      return CheckFailure;
    }

    return `system spent ${roundDuration(avg60Dur, 2)} of the last 60s waiting`;
  } catch {
    return CheckFailure;
  }
}

function pressureToDuration(pressure: number, base: number): number {
  return base * (pressure / 100) * 1000; // convert to milliseconds
}

function roundDuration(ms: number, places: number): string {
  const seconds = ms / 1000;

  return `${seconds.toFixed(places)}s`;
}
