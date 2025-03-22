import { expect, test } from 'vitest';
import { createMockSimulationContext } from '~/test-utils/create-mock-simulation-context';
import { ActivityCheckpointType } from '~/types';
import { hashObject } from '~/utils/hash-object';
import { createStartedCheckpoint } from './create-started-checkpoint';

test('it creates a started checkpoint', () => {
  const ctx = createMockSimulationContext();
  const checkpoint = createStartedCheckpoint(ctx);

  expect(checkpoint).toStrictEqual({
    hash: expect.any(String),
    seed: ctx.rng.seed,
    time: 0,
    type: ActivityCheckpointType.Started,
  });
});

test('it includes a hash based on checkpoint data', () => {
  const ctx = createMockSimulationContext();
  const checkpoint = createStartedCheckpoint(ctx);

  const { hash, ...hashParts } = checkpoint;

  expect(hash).toStrictEqual(hashObject(hashParts));
});
