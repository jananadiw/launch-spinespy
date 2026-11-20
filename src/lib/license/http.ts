import { NextResponse, type NextRequest } from "next/server";
import { rateLimit, RATE_LIMITS } from "./rate-limit";

/** Shared helpers for the license and checkout route handlers. */

export const NO_STORE_HEADERS = {
  "Cache-Control": "no-store",
  "X-Robots-Tag": "noindex, nofollow",
};

export function json(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return NextResponse.json(body, { status, headers: { ...NO_STORE_HEADERS, ...headers } });
}

/** Vercel sets x-real-ip. x-forwarded-for is the fallback for other hosts. */
export function getClientIp(request: NextRequest): string {
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

/** Returns a 429 response when the caller is over the limit, otherwise null. */
export function limitByIp(
  request: NextRequest,
  bucket: keyof typeof RATE_LIMITS,
): NextResponse | null {
  const { limit, windowMs } = RATE_LIMITS[bucket];
  const result = rateLimit(`${bucket}:${getClientIp(request)}`, limit, windowMs);
  if (result.allowed) return null;
  return json(
    { error: "rate_limited" },
    429,
    { "Retry-After": String(result.retryAfterSeconds) },
  );
}

/** Parses a JSON object body. Returns null for invalid JSON or a non-object. */
export async function readJsonObject(request: NextRequest): Promise<Record<string, unknown> | null> {
  try {
    const body: unknown = await request.json();
    return body && typeof body === "object" && !Array.isArray(body)
      ? (body as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

/** Trimmed string within maxLength, or null. */
export function readString(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 && trimmed.length <= maxLength ? trimmed : null;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function readEmail(value: unknown): string | null {
  const email = readString(value, 254);
  return email && EMAIL_PATTERN.test(email) ? email.toLowerCase() : null;
}
