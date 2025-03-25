import { expect, test } from 'vitest';
import { renderHook } from '@testing-library/react';
import type { CharacterAppState } from '@vers/idle-core';
import { EntityStatus } from '@vers/idle-core';
import { setCharacter } from './set-character';
import { useCharacterStore } from './use-character-store';

test('it updates the character state', () => {
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

  setCharacter(character);

  const { result } = renderHook(() =>
    useCharacterStore((state) => state.character),
  );

  expect(result.current).toStrictEqual({
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
  });
});
