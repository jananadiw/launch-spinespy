/**
 * Fixed-window, in-memory rate limiter.
 *
 * Limits are per server instance. On Vercel each warm function instance keeps
 * its own counts, so the real ceiling is limit × instances. Good enough to stop
 * casual key guessing and email spam.
 * TODO: Move to a shared store (e.g. Upstash Redis via Vercel Marketplace)
 * if abuse shows up.
 */

interface Window {
  count: number;
  resetAt: number;
}

const globalForLimits = globalThis as unknown as {
  __spinespyRateLimits?: Map<string, Window>;
};

function windows(): Map<string, Window> {
  globalForLimits.__spinespyRateLimits ??= new Map();
  return globalForLimits.__spinespyRateLimits;
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const map = windows();

  // Drop expired windows now and then so the map cannot grow without bound.
  if (map.size > 10_000) {
    for (const [k, w] of map) if (w.resetAt <= now) map.delete(k);
  }

  const current = map.get(key);
  if (!current || current.resetAt <= now) {
    map.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (current.count >= limit) {
    return { allowed: false, retryAfterSeconds: Math.ceil((current.resetAt - now) / 1000) };
  }

  current.count++;
  return { allowed: true, retryAfterSeconds: 0 };
}

export function resetRateLimits(): void {
  globalForLimits.__spinespyRateLimits = new Map();
}

const MINUTE = 60_000;

/** Per-IP limits for each public endpoint. */
export const RATE_LIMITS = {
  activate: { limit: 10, windowMs: MINUTE },
  deactivate: { limit: 10, windowMs: MINUTE },
  validate: { limit: 30, windowMs: MINUTE },
  resend: { limit: 5, windowMs: MINUTE },
  /** Per email address, across all IPs. Stops someone flooding one inbox. */
  resendPerEmail: { limit: 3, windowMs: 60 * MINUTE },
  checkout: { limit: 10, windowMs: MINUTE },
} as const;
