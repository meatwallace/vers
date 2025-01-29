import { isExpiredJWT } from './is-expired-jwt.server';

it('returns true for expired tokens', () => {
  // Token with exp: 1700000000 (November 14, 2023)
  const expiredToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MDAwMDAwMDB9.TQ7TZyZmhxN2o9vJmq7Hl2CjrJqjVVL95o_qvJqWXD8';

  expect(isExpiredJWT(expiredToken)).toBe(true);
});

it('returns false for valid tokens', () => {
  // Token with exp: 4070908800 (January 1, 2099)
  const validToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjQwNzA5MDg4MDB9.DXvoVDK5BF_TjiX-pMj0t99mB2kj6Yz0Q8wzrCVtkpM';

  expect(isExpiredJWT(validToken)).toBe(false);
});
