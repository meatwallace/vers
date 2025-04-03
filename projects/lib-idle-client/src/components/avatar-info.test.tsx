import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { AvatarAppState } from '@vers/idle-core';
import { nodeHasText } from '@vers/client-test-utils';
import { EntityStatus } from '@vers/idle-core';
import { AvatarInfo } from './avatar-info';

test('it renders avatar information', () => {
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

  render(<AvatarInfo avatar={avatar} />);

  const avatarName = screen.getByText('Test Avatar');
  const [lifeBar] = screen.getAllByText(nodeHasText('Life: 75 / 100'));

  expect(avatarName).toBeInTheDocument();
  expect(lifeBar).toBeInTheDocument();
});
