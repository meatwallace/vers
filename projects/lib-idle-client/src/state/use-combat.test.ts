import { expect, test } from 'vitest';
import { renderHook } from '@testing-library/react';
import type { CombatExecutorAppState } from '@vers/idle-core';
import { setCombat } from './set-combat';
import { useCombat } from './use-combat';

test('it provides the combat state', () => {
  const combat: CombatExecutorAppState = {
    elapsed: 1000,
  };

  setCombat(combat);

  const { result } = renderHook(() => useCombat());

  expect(result.current).toStrictEqual({
    elapsed: 1000,
  });
});
