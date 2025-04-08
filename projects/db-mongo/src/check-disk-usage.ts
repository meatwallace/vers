import fs from 'node:fs/promises';
import prettyBytes from 'pretty-bytes';
import { CheckFailure } from './consts';

export async function checkDiskUsage(
  dir: string,
): Promise<string | typeof CheckFailure> {
  try {
    const stats = await fs.statfs(dir);

    const available = stats.bavail * stats.bsize;
    const total = stats.blocks * stats.bsize;
    const percentAvailable = (available / total) * 100;

    if (percentAvailable < 10) {
      return CheckFailure;
    }

    const bytesAvailable = prettyBytes(available);

    return `${bytesAvailable} (${percentAvailable.toFixed(1)}%) free`;
  } catch {
    return CheckFailure;
  }
}
