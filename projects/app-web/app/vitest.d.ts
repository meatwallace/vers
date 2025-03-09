import { expect } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

// vitest instead `@vitest/expect`
declare module 'vitest' {
  type JestAssertion<T> = matchers.TestingLibraryMatchers<
    ReturnType<typeof expect.stringContaining>,
    T
  >;
}
