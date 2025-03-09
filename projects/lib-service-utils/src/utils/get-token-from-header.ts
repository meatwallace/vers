export function getTokenFromHeader(
  header: string | null | undefined,
): string | null {
  if (!header) {
    return null;
  }

  const headerParts = header.split(/\s+/);

  if (headerParts.length !== 2) {
    return null;
  }

  const [, token] = headerParts;

  return token;
}
