import { after, type NextRequest } from "next/server";
import { json, limitByIp, readEmail, readJsonObject } from "@/lib/license/http";
import { rateLimit, RATE_LIMITS } from "@/lib/license/rate-limit";
import { RESEND_MESSAGE } from "@/lib/license/copy";
import { resendLicenseEmails } from "@/lib/license/service";

/**
 * POST { email } -> { message }
 * The reply is the same whether or not the email has a purchase. The send runs
 * after the response, so response time does not reveal it either.
 */
export async function POST(request: NextRequest) {
  const limited = limitByIp(request, "resend");
  if (limited) return limited;

  const body = await readJsonObject(request);
  const email = readEmail(body?.email);
  if (!email) return json({ error: "Enter a valid email address." }, 400);

  const { limit, windowMs } = RATE_LIMITS.resendPerEmail;
  const perEmail = rateLimit(`resend-email:${email}`, limit, windowMs);

  // Over the per-email limit: skip the send but give the same reply.
  if (perEmail.allowed) {
    after(async () => {
      try {
        await resendLicenseEmails(email);
      } catch (error) {
        console.error("License resend failed:", error);
      }
    });
  }

  return json({ message: RESEND_MESSAGE });
}
