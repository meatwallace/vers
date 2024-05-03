export function getTokenFromHeader(
  header: string | null | undefined,
): string | null {
  if (!header) {
    return null;
  }

  const [, token] = header.split(/\s+/);

  return token ?? null;
}
