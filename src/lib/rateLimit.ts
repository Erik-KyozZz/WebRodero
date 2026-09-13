/**
 * Simple, fast sliding-window IP rate limiter for API endpoints
 */
interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const ipStore = new Map<string, RateLimitRecord>();

// Cleanup stale entries every 5 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of ipStore.entries()) {
    if (now > record.resetTime) {
      ipStore.delete(ip);
    }
  }
}, 5 * 60 * 1000);

export function rateLimit(
  ip: string,
  limit: number = 30,
  windowMs: number = 60 * 1000
): { success: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const record = ipStore.get(ip);

  if (!record || now > record.resetTime) {
    ipStore.set(ip, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { success: true, remaining: limit - 1, resetTime: now + windowMs };
  }

  if (record.count >= limit) {
    return { success: false, remaining: 0, resetTime: record.resetTime };
  }

  record.count += 1;
  return { success: true, remaining: limit - record.count, resetTime: record.resetTime };
}
