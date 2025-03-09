import { jwtDecode } from 'jwt-decode';

interface JWTPayload {
  exp: number;
}

export function isExpiredJWT(token: string): boolean {
  const decoded = jwtDecode<JWTPayload>(token);
  const currentTime = Math.floor(Date.now() / 1000);

  return decoded.exp < currentTime;
}
