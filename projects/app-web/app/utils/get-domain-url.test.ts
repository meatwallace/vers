import { expect, test } from 'vitest';
import { getDomainURL } from './get-domain-url';

test('it uses X-Forwarded headers when available', () => {
  const request = new Request('http://example.com');

  request.headers.set('X-Forwarded-Host', 'forwarded.example.com');
  request.headers.set('X-Forwarded-Proto', 'https');

  const result = getDomainURL(request);

  expect(result).toBe('https://forwarded.example.com');
});

test('it falls back to host header when X-Forwarded headers are not present', () => {
  const request = new Request('http://example.com');

  request.headers.set('host', 'host.example.com');

  const result = getDomainURL(request);

  expect(result).toBe('http://host.example.com');
});

test('it falls back to URL when no headers are present', () => {
  const request = new Request('https://fallback.example.com/path');

  const result = getDomainURL(request);

  expect(result).toBe('http://fallback.example.com');
});
