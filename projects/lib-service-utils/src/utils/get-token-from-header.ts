export function getTokenFromHeader(header: string | null): string | null {
  if (header === null) {
    return null;
  }

  const [, token] = header.split(/\s+/);

  return token ?? null;
}
