import { NotImplementedError, type EmailProvider } from "../types";

/**
 * Real license email via Resend. Phase 2.
 *
 * TODO(phase2): Implement with the `resend` SDK (already a dependency):
 *   - const { subject, html, text } = renderLicenseEmail({ key })  // ../email-template
 *   - await new Resend(process.env.RESEND_API_KEY).emails.send({
 *       from: `SpineSpy <${process.env.LICENSE_FROM_EMAIL}>`,  // hello@spinespy.com
 *       to: email, subject, html, text,
 *     })
 *   - The SDK returns { data, error } instead of throwing. Throw on `error`
 *     so fulfillment leaves emailSentAt empty and the Stripe retry sends again.
 *   - Verify the spinespy.com domain in Resend (SPF/DKIM DNS records) first.
 */
export const resendEmailProvider: EmailProvider = {
  async sendLicenseEmail() {
    throw new NotImplementedError("Resend email");
  },
};
