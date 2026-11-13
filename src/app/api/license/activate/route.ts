import { NextRequest, NextResponse } from "next/server";
import { activateLicense } from "@/lib/license";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(identifier: string, limit = 10, windowMs = 60000): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(identifier, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  const clientIp = request.headers.get("x-forwarded-for") || "unknown";
  
  if (!checkRateLimit(clientIp)) {
    return NextResponse.json(
      {
        error: "Too many requests. Please try again later.",
        code: "RATE_LIMIT_EXCEEDED",
      },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { key, device_id_hash } = body;

    if (!key || typeof key !== "string") {
      return NextResponse.json(
        { error: "License key is required", code: "MISSING_KEY" },
        { status: 400 }
      );
    }

    if (!device_id_hash || typeof device_id_hash !== "string") {
      return NextResponse.json(
        { error: "Device ID hash is required", code: "MISSING_DEVICE_ID" },
        { status: 400 }
      );
    }

    const result = await activateLicense(key, device_id_hash);

    return NextResponse.json({
      success: true,
      instance_id: result.instance_id,
      token: result.token,
    });
  } catch (error) {
    console.error("License activation error:", error);

    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const statusCode = errorMessage.includes("not found") ? 404 
      : errorMessage.includes("revoked") ? 403
      : errorMessage.includes("already activated") ? 409
      : 500;

    return NextResponse.json(
      {
        error: errorMessage,
        code: errorMessage.includes("not found") ? "LICENSE_NOT_FOUND"
          : errorMessage.includes("revoked") ? "LICENSE_REVOKED"
          : errorMessage.includes("already activated") ? "MAX_ACTIVATIONS_REACHED"
          : "ACTIVATION_ERROR",
      },
      { status: statusCode }
    );
  }
}
