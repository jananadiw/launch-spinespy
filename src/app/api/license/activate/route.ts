import type { NextRequest } from "next/server";
import { json, limitByIp, readJsonObject, readString } from "@/lib/license/http";
import { normalizeLicenseKey } from "@/lib/license/key";
import { activateLicense } from "@/lib/license/service";

/**
 * POST { key, deviceId, deviceName } -> { status: "ok" | "invalid" | "revoked" | "limit_reached" }
 * Re-activating a device that is already active returns "ok".
 */
export async function POST(request: NextRequest) {
  const limited = limitByIp(request, "activate");
  if (limited) return limited;

  const body = await readJsonObject(request);
  const deviceId = readString(body?.deviceId, 200);
  if (!body || !deviceId) return json({ error: "deviceId is required" }, 400);

  const key = normalizeLicenseKey(body.key);
  if (!key) return json({ status: "invalid" });

  const deviceName = readString(body.deviceName, 100) ?? "Mac";

  try {
    return json({ status: await activateLicense({ key, deviceId, deviceName }) });
  } catch (error) {
    console.error("License activate failed:", error);
    return json({ error: "server_error" }, 500);
  }
}
