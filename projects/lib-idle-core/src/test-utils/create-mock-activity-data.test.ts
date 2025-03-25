import { expect, test } from 'vitest';
import { ActivityFailureAction, ActivityType } from '../types';
import { createMockActivityData } from './create-mock-activity-data';
import { createMockEnemyData } from './create-mock-enemy-data';

test('it creates activity data with expected properties', () => {
  const activity = createMockActivityData();

  expect(activity).toStrictEqual({
    enemies: [
      {
        level: 1,
        life: 30,
        name: 'Test Enemy',
        primaryAttack: {
          maxDamage: 3,
          minDamage: 1,
          speed: 0.5,
        },
      },
    ],
    failureAction: ActivityFailureAction.Retry,
    id: expect.any(String),
    name: 'Aether Node',
    type: ActivityType.AetherNode,
  });
});

test('it creates activity data with custom properties', () => {
  const enemy = createMockEnemyData();

  const activity = createMockActivityData({
    enemies: [enemy],
    failureAction: ActivityFailureAction.Abort,
    id: 'custom-activity',
    name: 'Custom Activity',
    type: ActivityType.AetherNode,
  });

  expect(activity).toStrictEqual({
    enemies: [enemy],
    failureAction: ActivityFailureAction.Abort,
    id: 'custom-activity',
    name: 'Custom Activity',
    type: ActivityType.AetherNode,
  });
});
