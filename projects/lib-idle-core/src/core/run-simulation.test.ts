import { expect, test } from 'vitest';
import { createMockActivityData } from '../test-utils/create-mock-activity-data';
import { createMockCharacterData } from '../test-utils/create-mock-character-data';
import { createMockEnemyData } from '../test-utils/create-mock-enemy-data';
import {
  ActivityCheckpointType,
  ActivityFailureAction,
  ActivityType,
} from '../types';
import { runSimulation } from './run-simulation';

test('runs a simulation with default configuration', async () => {
  const character = createMockCharacterData();

  const seed = 3_047_525_658;

  const activity = createMockActivityData({
    enemies: [createMockEnemyData()],
    failureAction: ActivityFailureAction.Retry,
    id: 'aether_node_1',
    type: ActivityType.AetherNode,
  });

  const config = {
    duration: 80_000,
    initialSeed: seed,
  };

  const result = await runSimulation(activity, character, config);

  // eslint-disable-next-line vitest/no-large-snapshots
  expect(result).toMatchInlineSnapshot(`
    {
      "checkpoints": [
        {
          "hash": "cbd6cc9427a79b1e",
          "seed": 3047525658,
          "time": 0,
          "type": "started",
        },
        {
          "hash": "821c9638d7fb4849",
          "nextSeed": 685112472,
          "time": 16300,
          "type": "enemy_group_killed",
        },
        {
          "hash": "c7afb619f53637d9",
          "nextSeed": 2866488649,
          "time": 36300,
          "type": "enemy_group_killed",
        },
        {
          "hash": "c9a546d9b43f3966",
          "nextSeed": 2249575321,
          "time": 46300,
          "type": "enemy_group_killed",
        },
        {
          "hash": "68124fb1a559feca",
          "nextSeed": 3183217100,
          "time": 57600,
          "type": "enemy_group_killed",
        },
        {
          "hash": "0ad2f691a6d94aa0",
          "nextSeed": 4197947599,
          "time": 57600,
          "type": "completed",
        },
        {
          "hash": "f1dd0c3fcae677d9",
          "seed": 4197947599,
          "time": 0,
          "type": "started",
        },
        {
          "hash": "0a54cbefb4ffd9e4",
          "nextSeed": 2381219441,
          "time": 18800,
          "type": "enemy_group_killed",
        },
      ],
      "elapsed": 80000,
    }
  `);
});

test('it respects duration limit and stops the simulation accordingly', async () => {
  const character = createMockCharacterData();
  const seed = 3_047_525_658;

  const activity = createMockActivityData({
    enemies: [createMockEnemyData()],
    failureAction: ActivityFailureAction.Retry,
    id: 'aether_node_1',
    type: ActivityType.AetherNode,
  });

  const config = {
    // the first group is killed at ~17 seconds on this seed
    duration: 10_000,
    initialSeed: seed,
  };

  const result = await runSimulation(activity, character, config);

  expect(result.checkpoints).toHaveLength(1);
  expect(result.checkpoints[0]?.type).toBe(ActivityCheckpointType.Started);
  expect(result.elapsed).toBe(10_000);
});

test('it stops at the specified seed if provided', async () => {
  const character = createMockCharacterData();
  const enemy = createMockEnemyData();

  const activity = createMockActivityData({
    enemies: [enemy],
    failureAction: ActivityFailureAction.Retry,
    id: 'aether_node_1',
    type: ActivityType.AetherNode,
  });

  const config = {
    // set a long duration so we always reach the right value
    duration: 200_000,
    initialSeed: 3_047_525_658,
    // when our algo changes, can just pull this seed to something valid from our
    // happy path snapshot test ouput
    stopAtSeed: 4_197_947_599,
  };

  const result = await runSimulation(activity, character, config);

  const [finalCheckpoint] = result.checkpoints.slice(-1);

  expect(finalCheckpoint).toStrictEqual({
    hash: expect.any(String),
    nextSeed: config.stopAtSeed,
    time: expect.any(Number),
    type: ActivityCheckpointType.Completed,
  });
});

test('it aborts on failure if failure action is set to abort', async () => {
  // set our life to 1 so we die immediately
  const character = createMockCharacterData({ life: 1 });
  const enemy = createMockEnemyData();

  const activity = createMockActivityData({
    enemies: [enemy],
    failureAction: ActivityFailureAction.Abort,
    id: 'aether_node_1',
    type: ActivityType.AetherNode,
  });

  const config = {
    duration: 100_000,
    initialSeed: 3_047_525_658,
  };

  const result = await runSimulation(activity, character, config);

  const failedCheckpoints = result.checkpoints.filter(
    (cp) => cp.type === ActivityCheckpointType.Failed,
  );

  expect(failedCheckpoints).toHaveLength(1);

  const lastCheckpoint = result.checkpoints.at(-1);

  expect(lastCheckpoint).toStrictEqual({
    hash: expect.any(String),
    nextSeed: expect.any(Number),
    time: expect.any(Number),
    type: ActivityCheckpointType.Failed,
  });
});

test('it retries when failure action is set to retry', async () => {
  // set our life to 1 so we die immediately
  const character = createMockCharacterData({ life: 1 });
  const enemy = createMockEnemyData();

  const activity = createMockActivityData({
    enemies: [enemy],
    failureAction: ActivityFailureAction.Retry,
    id: 'aether_node_1',
    type: ActivityType.AetherNode,
  });

  const config = {
    duration: 10_000,
    initialSeed: 3_047_525_658,
  };

  const result = await runSimulation(activity, character, config);

  const failedCheckpoints = result.checkpoints.filter(
    (cp) => cp.type === ActivityCheckpointType.Failed,
  );

  expect(failedCheckpoints.length).toBeGreaterThan(1);
});
