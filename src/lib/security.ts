import { randomBytes, randomUUID } from 'crypto';

/**
 * Generates an unguessable, human-readable booking reference.
 * Format: MP-YYYY-XXXX (e.g., MP-2026-7KM9)
 */
export function generateBookingReference(): string {
  const year = new Date().getFullYear();
  // Exclude ambiguous characters: 0, O, 1, I, L
  const chars = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
  let randomPart = '';
  const bytes = randomBytes(4);
  for (let i = 0; i < 4; i++) {
    randomPart += chars[bytes[i] % chars.length];
  }
  return `MP-${year}-${randomPart}`;
}

/**
 * Generates a cryptographically strong UUID access token
 * for customer self-service actions (view, reschedule, cancel).
 */
export function generateAccessToken(): string {
  return randomUUID();
}

/**
 * Sanitize basic customer input strings
 */
export function sanitizeString(input: string | undefined | null): string {
  if (!input) return '';
  return input
    .trim()
    .replace(/[<>]/g, '') // Strip basic HTML tags
    .slice(0, 1000); // Prevent payload abuse
}

/**
 * In-memory sliding window rate limiter to protect public actions against bot floods.
 */
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

export function checkRateLimit(key: string, limit = 5, windowMs = 60 * 1000): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  // Clean old entries periodically
  if (rateLimitMap.size > 10000) {
    rateLimitMap.clear();
  }

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true };
  }

  if (entry.count >= limit) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
    return { allowed: false, retryAfterSeconds: retryAfter };
  }

  entry.count += 1;
  return { allowed: true };
}
