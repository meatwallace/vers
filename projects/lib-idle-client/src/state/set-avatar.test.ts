import { expect, test } from 'vitest';
import { renderHook } from '@testing-library/react';
import type { AvatarAppState } from '@vers/idle-core';
import { EntityStatus } from '@vers/idle-core';
import { setAvatar } from './set-avatar';
import { useAvatarStore } from './use-avatar-store';

test('it updates the avatar state', () => {
  const avatar: AvatarAppState = {
    behaviours: {
      playerWeaponAttack: {
        lastAttackTime: 0,
      },
    },
    id: '1',
    image: '/assets/images/avatar-placeholder.png',
    isAlive: true,
    level: 1,
    life: 75,
    mainHandAttack: {
      maxDamage: 10,
      minDamage: 5,
      speed: 1,
    },
    maxLife: 100,
    name: 'Test Avatar',
    status: EntityStatus.Alive,
  };

  setAvatar(avatar);

  const { result } = renderHook(() => useAvatarStore((state) => state.avatar));

  expect(result.current).toStrictEqual({
    behaviours: {
      playerWeaponAttack: {
        lastAttackTime: 0,
      },
    },
    id: '1',
    image: '/assets/images/avatar-placeholder.png',
    isAlive: true,
    level: 1,
    life: 75,
    mainHandAttack: {
      maxDamage: 10,
      minDamage: 5,
      speed: 1,
    },
    maxLife: 100,
    name: 'Test Avatar',
    status: EntityStatus.Alive,
  });
});
