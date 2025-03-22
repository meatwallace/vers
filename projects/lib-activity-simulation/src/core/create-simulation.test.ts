import { expect, test, vi } from 'vitest';
import { createMockActivityData } from '~/test-utils/create-mock-activity-data';
import { createMockCharacterData } from '~/test-utils/create-mock-character-data';
import { ActivityCheckpointType } from '../types';
import { createSimulation } from './create-simulation';

test('it initializes with the expected values', () => {
  const characterData = createMockCharacterData();
  const seed = 12_345;

  const simulation = createSimulation(characterData, seed);

  expect(simulation.seed).toBe(seed);
  expect(simulation.elapsed).toBe(0);
  expect(simulation.activity).toBeNull();
});

test('it starts an activity', () => {
  const characterData = createMockCharacterData();
  const simulation = createSimulation(characterData, 12_345);
  const activityData = createMockActivityData();

  simulation.startActivity(activityData);

  expect(simulation.activity).toMatchObject({
    id: activityData.id,
    type: activityData.type,
  });
});

test('it calls an event listener when starting an activity', () => {
  const characterData = createMockCharacterData();
  const simulation = createSimulation(characterData, 12_345);
  const activityData = createMockActivityData();

  const listenerSpy = vi.fn();

  simulation.addEventListener('started', listenerSpy);
  simulation.startActivity(activityData);

  expect(listenerSpy).toHaveBeenCalledOnce();
  expect(listenerSpy).toHaveBeenCalledWith(simulation.state);
});

test('it stops an activity', async () => {
  const characterData = createMockCharacterData();
  const simulation = createSimulation(characterData, 12_345);
  const activityData = createMockActivityData();

  simulation.startActivity(activityData);

  await simulation.stopActivity();

  expect(simulation.activity).toBeNull();
});

test('it calls an event listener when stopping an activity', async () => {
  const characterData = createMockCharacterData();
  const simulation = createSimulation(characterData, 12_345);
  const activityData = createMockActivityData();

  const listenerSpy = vi.fn();

  simulation.addEventListener('stopped', listenerSpy);
  simulation.startActivity(activityData);

  await simulation.stopActivity();

  expect(listenerSpy).toHaveBeenCalledOnce();
  expect(listenerSpy).toHaveBeenCalledWith(simulation.state);
});

test('it restarts an activity', () => {
  const characterData = createMockCharacterData();
  const simulation = createSimulation(characterData, 12_345);
  const activityData = createMockActivityData();

  simulation.startActivity(activityData);

  const originalActivity = simulation.activity;

  simulation.restartActivity();

  expect(simulation.activity).not.toBe(originalActivity);
  expect(simulation.activity).not.toBeNull();
});

test('it calls an event listener when restarting an activity', () => {
  const characterData = createMockCharacterData();
  const simulation = createSimulation(characterData, 12_345);
  const activityData = createMockActivityData();

  const listenerSpy = vi.fn();

  simulation.addEventListener('restarted', listenerSpy);
  simulation.startActivity(activityData);

  simulation.restartActivity();

  expect(listenerSpy).toHaveBeenCalledOnce();
  expect(listenerSpy).toHaveBeenCalledWith(simulation.state);
});

test('it resets the character when restarting an activity', () => {
  const characterData = createMockCharacterData({ life: 100 });
  const simulation = createSimulation(characterData, 12_345);
  const activityData = createMockActivityData();

  simulation.startActivity(activityData);

  simulation.state.character.receiveDamage(50);

  expect(simulation.state.character.life).toBe(50);

  simulation.restartActivity();

  expect(simulation.state.character.life).toBe(100);
});

test('it runs an activity and returns checkpoints', async () => {
  const characterData = createMockCharacterData();
  const simulation = createSimulation(characterData, 12_345);
  const activityData = createMockActivityData();

  simulation.startActivity(activityData);

  const firstCheckpoint = await simulation.run(100);

  expect(firstCheckpoint).toStrictEqual({
    hash: expect.any(String),
    seed: expect.any(Number),
    time: 0,
    type: ActivityCheckpointType.Started,
  });

  const secondCheckpoint = await simulation.run(10_000);

  expect(secondCheckpoint).toStrictEqual({
    hash: expect.any(String),
    nextSeed: expect.any(Number),
    time: expect.any(Number),
    type: ActivityCheckpointType.EnemyGroupKilled,
  });

  expect(simulation.elapsed).toBe(10_100);
});

test('it calls an event listener when the state updates', async () => {
  const characterData = createMockCharacterData();
  const simulation = createSimulation(characterData, 12_345);
  const activityData = createMockActivityData();

  const listenerSpy = vi.fn();

  simulation.addEventListener('updated', listenerSpy);
  simulation.startActivity(activityData);

  // skip our initialisation state
  await simulation.run(1);

  // run long enough for an attack cycle to occur
  await simulation.run(5000);

  expect(listenerSpy).toHaveBeenCalledOnce();
  expect(listenerSpy).toHaveBeenCalledWith(simulation.state);
});
