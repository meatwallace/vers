import { expect, test } from 'vitest';
import { createMockActivityData } from '~/test-utils/create-mock-activity-data';
import { createMockSimulationContext } from '~/test-utils/create-mock-simulation-context';
import { ActivityCheckpointType } from '~/types';
import { hashObject } from '~/utils/hash-object';
import { createActivity } from '../create-activity';
import { createEnemyGroupKilledCheckpoint } from './create-enemy-group-killed-checkpoint';

test('it creates a enemy group killed checkpoint', () => {
  const ctx = createMockSimulationContext();
  const activityData = createMockActivityData();
  const activity = createActivity(activityData, ctx);

  activity.elapseTime(2500);

  const checkpoint = createEnemyGroupKilledCheckpoint(activity, ctx);

  expect(checkpoint).toStrictEqual({
    hash: expect.any(String),
    nextSeed: expect.any(Number),
    time: 2500,
    type: ActivityCheckpointType.EnemyGroupKilled,
  });
});

test('it includes a hash based on checkpoint data', () => {
  const ctx = createMockSimulationContext();
  const activityData = createMockActivityData();
  const activity = createActivity(activityData, ctx);

  activity.elapseTime(2500);

  const checkpoint = createEnemyGroupKilledCheckpoint(activity, ctx);

  const { hash, ...hashParts } = checkpoint;

  expect(hash).toStrictEqual(hashObject(hashParts));
});
