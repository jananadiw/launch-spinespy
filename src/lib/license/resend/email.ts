import { Resend } from "resend";
import { requireEnv } from "../config";
import { renderLicenseEmail } from "../email-template";
import type { EmailProvider } from "../types";

type ResendLike = Pick<Resend, "emails">;

let client: Resend | null = null;
let clientKey: string | null = null;

function getResend(): ResendLike {
  const key = requireEnv("RESEND_API_KEY");
  if (!client || clientKey !== key) {
    client = new Resend(key);
    clientKey = key;
  }
  return client;
}

/**
 * Real license email via Resend. The SDK returns { data, error } instead of
 * throwing, so an error is rethrown: fulfillment then leaves emailSentAt empty
 * and Stripe's webhook retry sends again.
 */
export function createResendEmailProvider(resend: () => ResendLike = getResend): EmailProvider {
  return {
    async sendLicenseEmail({ email, key }) {
      const from = requireEnv("LICENSE_FROM_EMAIL");
      const { subject, html, text } = renderLicenseEmail({ key });
      const { error } = await resend().emails.send({
        from: `SpineSpy <${from}>`,
        to: email,
        subject,
        html,
        text,
      });
      if (error) throw new Error(`Resend failed: ${error.name}: ${error.message}`);
    },
  };
}

export const resendEmailProvider = createResendEmailProvider();
