import { expect, test } from 'vitest';
import { getRadiansFromDegrees } from './get-radians-from-degrees';

test.each([
  { degrees: 0, radians: 0 },
  { degrees: 90, radians: 1.570_796_326 },
  { degrees: 180, radians: 3.141_592_653 },
  { degrees: 360, radians: 6.283_185_307 },
  { degrees: -45, radians: -0.785_398_163 },
])(
  'it converts $degrees degrees to $radians radians',
  ({ degrees, radians }) => {
    const result = getRadiansFromDegrees(degrees);

    expect(result).toBeCloseTo(radians, 8);
  },
);
