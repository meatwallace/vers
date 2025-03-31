import { expect, test } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useIsDevCameraActive } from './use-is-dev-camera-active';

test('it returns the current is dev camera active state', () => {
  const { result } = renderHook(() => useIsDevCameraActive());

  expect(result.current).toBeFalse();
});
