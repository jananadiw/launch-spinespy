import { NextRequest, NextResponse } from "next/server";
import { deactivateLicense } from "@/lib/license";

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
    const { key, instance_id } = body;

    if (!key || typeof key !== "string") {
      return NextResponse.json(
        { error: "License key is required", code: "MISSING_KEY" },
        { status: 400 }
      );
    }

    if (!instance_id || typeof instance_id !== "string") {
      return NextResponse.json(
        { error: "Instance ID is required", code: "MISSING_INSTANCE_ID" },
        { status: 400 }
      );
    }

    await deactivateLicense(key, instance_id);

    return NextResponse.json({
      success: true,
      message: "License deactivated successfully",
    });
  } catch (error) {
    console.error("License deactivation error:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to deactivate license",
        code: "DEACTIVATION_ERROR",
      },
      { status: 500 }
    );
  }
}
