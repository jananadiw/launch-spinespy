import { NextResponse, type NextRequest } from "next/server";
import { json, limitByIp, NO_STORE_HEADERS, readEmail, readJsonObject, readString } from "@/lib/license/http";
import { createCheckoutSession } from "@/lib/license/service";
import { NotImplementedError } from "@/lib/license/types";

/**
 * POST { deviceId?, email? } -> { url }
 * The browser goes to `url`: Stripe Checkout in Phase 2, /thanks in mock mode.
 * Both fields are optional. The Mac app may send deviceId; the site sends {}.
 */
export async function POST(request: NextRequest) {
  const limited = limitByIp(request, "checkout");
  if (limited) return limited;

  const body = (await readJsonObject(request)) ?? {};
  const deviceId = readString(body.deviceId, 200) ?? undefined;
  const email = readEmail(body.email) ?? undefined;

  try {
    const { url } = await createCheckoutSession({ deviceId, email });
    return json({ url });
  } catch (error) {
    console.error("Checkout failed:", error);
    const status = error instanceof NotImplementedError ? 503 : 500;
    return json({ error: "Checkout is unavailable. Please try again later." }, status);
  }
}

/** No side effects: send people home so checkout only starts from the button. */
export async function GET(request: NextRequest) {
  return NextResponse.redirect(new URL("/", request.url), { status: 307, headers: NO_STORE_HEADERS });
}
