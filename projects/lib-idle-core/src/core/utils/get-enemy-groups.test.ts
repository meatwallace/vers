import { expect, test } from 'vitest';
import type { EnemyGroup } from 'src/types';
import { createMockActivityData } from '../../test-utils/create-mock-activity-data';
import { createMockSimulationContext } from '../../test-utils/create-mock-simulation-context';
import { getEnemyGroups } from './get-enemy-groups';

test('it returns groups of the specified size', () => {
  const activity = createMockActivityData();
  const ctx = createMockSimulationContext();

  const groups = getEnemyGroups(activity, ctx, { groupSize: 3 });

  expect(groups).toSatisfyAll(
    (group: EnemyGroup) => group.enemies.length === 3,
  );
});

test('it returns the specified number of groups', () => {
  const activity = createMockActivityData();
  const ctx = createMockSimulationContext();

  const groups = getEnemyGroups(activity, ctx, { groupCount: 3 });

  expect(groups).toHaveLength(3);
});
