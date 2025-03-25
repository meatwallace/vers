import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { CharacterAppState } from '@vers/idle-core';
import { nodeHasText } from '@vers/client-test-utils';
import { EntityStatus } from '@vers/idle-core';
import { CharacterInfo } from './character-info';

test('it renders character information', () => {
  const character: CharacterAppState = {
    behaviours: {
      playerWeaponAttack: {
        lastAttackTime: 0,
      },
    },
    id: '1',
    isAlive: true,
    level: 1,
    life: 75,
    mainHandAttack: {
      maxDamage: 10,
      minDamage: 5,
      speed: 1,
    },
    maxLife: 100,
    name: 'Test Character',
    status: EntityStatus.Alive,
  };

  render(<CharacterInfo character={character} />);

  const characterName = screen.getByText('Test Character');
  const [lifeBar] = screen.getAllByText(nodeHasText('Life: 75 / 100'));

  expect(characterName).toBeInTheDocument();
  expect(lifeBar).toBeInTheDocument();
});
