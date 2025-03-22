import { expect, test } from 'vitest';
import { createMockEnemyData } from '~/test-utils/create-mock-enemy';
import { createMockPlayerCharacterData } from '~/test-utils/create-mock-player-character';
import { ActivityFailureAction, ActivityType } from '../types';
import { runServerSimulation } from './run-server-simulation';

test('it runs a simulation', async () => {
  const player = createMockPlayerCharacterData();
  const enemy = createMockEnemyData();

  const seed = 3_047_525_658;

  const activity = {
    enemies: [enemy],
    failureAction: ActivityFailureAction.Retry,
    id: 'aether_node_1',
    type: ActivityType.AetherNode,
  };

  const config = {
    duration: 140_000,
    initialSeed: seed,
  };

  const result = await runServerSimulation(activity, player, config);

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
          "hash": "fb1b4fd2d5cfa4a3",
          "nextSeed": 685112472,
          "time": 17000,
          "type": "enemy_group_killed",
        },
        {
          "hash": "9d5ee72adfc8ebe5",
          "nextSeed": 2600099813,
          "time": 53500,
          "type": "enemy_group_killed",
        },
        {
          "hash": "e6037259f06ca645",
          "nextSeed": 453605339,
          "time": 59900,
          "type": "failed",
        },
        {
          "hash": "d1e8421322908284",
          "seed": 453605339,
          "time": 0,
          "type": "started",
        },
      ],
      "elapsed": 130400,
      "finalSeed": 453605339,
    }
  `);
});
