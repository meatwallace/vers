import { rateLimiter } from 'hono-rate-limiter';

/**
 * Simple rate limit middleware that limits requests to our main API gateway.
 *
 * We use the IP address of the request to fingerprint our user. Not ideal, but
 * this operates in tandem with resolver-level rate limiting for more fine grained
 * control.
 */
export const rateLimitMiddleware = rateLimiter({
  keyGenerator: (ctx) => {
    const ipAddress = ctx.get('ipAddress');

    return ipAddress;
  },
  limit: 100, // 100 requests per window
  standardHeaders: 'draft-7',
  windowMs: 5 * 60 * 1000, // 5 minutes
});
