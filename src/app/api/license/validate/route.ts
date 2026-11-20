import type { NextRequest } from "next/server";
import { json, limitByIp, readJsonObject, readString } from "@/lib/license/http";
import { normalizeLicenseKey } from "@/lib/license/key";
import { validateLicense } from "@/lib/license/service";

/**
 * POST { key, deviceId } -> { status: "active" | "revoked" | "invalid" | "not_activated" }
 */
export async function POST(request: NextRequest) {
  const limited = limitByIp(request, "validate");
  if (limited) return limited;

  const body = await readJsonObject(request);
  const deviceId = readString(body?.deviceId, 200);
  if (!body || !deviceId) return json({ error: "deviceId is required" }, 400);

  const key = normalizeLicenseKey(body.key);
  if (!key) return json({ status: "invalid" });

  try {
    return json({ status: await validateLicense({ key, deviceId }) });
  } catch (error) {
    console.error("License validate failed:", error);
    return json({ error: "server_error" }, 500);
  }
}
