import { expect, test } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useIsAxesHelperVisible } from './use-is-axes-helper-visible';

test('it returns the current axes helper visibility state', () => {
  const { result } = renderHook(() => useIsAxesHelperVisible());

  expect(result.current).toBeFalse();
});
