import { afterEach, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from 'jest-extended';

expect.extend(matchers);

afterEach(() => {
  cleanup();
});
