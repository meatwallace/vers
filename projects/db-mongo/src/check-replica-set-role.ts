import { execa } from 'execa';
import type { ReplicaSetRole } from './types';
import { CheckFailure } from './consts';

interface IsMasterCommandResult {
  info: string;
  ismaster: boolean;
  secondary: boolean;
}

export async function checkReplicaSetRole(): Promise<
  ReplicaSetRole | typeof CheckFailure
> {
  const { stdout } =
    await execa`mongosh --eval "db.runCommand({ismaster:1})" --quiet --json`;

  const data = JSON.parse(stdout) as IsMasterCommandResult;

  if (data.ismaster) {
    return 'primary';
  }

  if (data.secondary) {
    return 'secondary';
  }

  if (data.info === 'Does not have a valid replica set config') {
    return 'non-initialized';
  }

  return CheckFailure;
}
