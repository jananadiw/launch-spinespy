import type { NextRequest } from "next/server";
import { json, limitByIp, readJsonObject, readString } from "@/lib/license/http";
import { normalizeLicenseKey } from "@/lib/license/key";
import { deactivateLicense } from "@/lib/license/service";

/**
 * POST { key, deviceId } -> { status: "ok" }
 * Frees the device slot. Unknown keys and devices also return "ok".
 */
export async function POST(request: NextRequest) {
  const limited = limitByIp(request, "deactivate");
  if (limited) return limited;

  const body = await readJsonObject(request);
  const deviceId = readString(body?.deviceId, 200);
  if (!body || !deviceId) return json({ error: "deviceId is required" }, 400);

  const key = normalizeLicenseKey(body.key);
  if (!key) return json({ status: "ok" });

  try {
    return json({ status: await deactivateLicense({ key, deviceId }) });
  } catch (error) {
    console.error("License deactivate failed:", error);
    return json({ error: "server_error" }, 500);
  }
}
