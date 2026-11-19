import { Resend } from "resend";
import { PRODUCTION_SITE_URL } from "./site";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const LICENSE_FROM_EMAIL = process.env.LICENSE_FROM_EMAIL || "noreply@spinespy.com";

export async function sendLicenseEmail(
  email: string,
  licenseKey: string
): Promise<void> {
  if (!RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not configured. Skipping email.");
    return;
  }

  const resend = new Resend(RESEND_API_KEY);

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your SpineSpy Pro License</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #f9f9f9; border-radius: 8px; padding: 30px; margin-bottom: 20px;">
    <h1 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">Your SpineSpy Pro License</h1>
    <p style="margin: 0 0 15px 0; font-size: 16px;">Thank you for purchasing SpineSpy Pro! Here's your license key:</p>
    <div style="background: white; border: 2px solid #e0e0e0; border-radius: 6px; padding: 20px; text-align: center; font-family: 'Monaco', 'Menlo', 'Courier New', monospace; font-size: 18px; font-weight: 600; letter-spacing: 1px; margin: 20px 0;">
      ${licenseKey}
    </div>
  </div>

  <div style="margin-bottom: 20px;">
    <h2 style="font-size: 18px; font-weight: 600; margin: 0 0 10px 0;">How to Activate</h2>
    <ol style="margin: 0; padding-left: 20px;">
      <li style="margin-bottom: 8px;">Open SpineSpy from your menubar</li>
      <li style="margin-bottom: 8px;">Click "Enter License"</li>
      <li style="margin-bottom: 8px;">Paste your license key</li>
      <li style="margin-bottom: 8px;">Enjoy SpineSpy Pro on up to 3 Macs</li>
    </ol>
  </div>

  <div style="background: #f0f7ff; border-left: 4px solid #0066cc; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
    <p style="margin: 0; font-size: 14px;"><strong>Pro Features Unlocked:</strong></p>
    <ul style="margin: 10px 0 0 0; padding-left: 20px; font-size: 14px;">
      <li>Floating pet companion</li>
      <li>Custom sound clips</li>
      <li>Phone distraction nudges</li>
    </ul>
  </div>

  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 14px; color: #666;">
    <p style="margin: 0 0 10px 0;">Questions? Reply to this email or visit <a href="${PRODUCTION_SITE_URL}" style="color: #0066cc; text-decoration: none;">${PRODUCTION_SITE_URL}</a></p>
    <p style="margin: 0; font-size: 13px;">You have 14 days for a full refund, no questions asked.</p>
  </div>
</body>
</html>
  `.trim();

  const text = `
Your SpineSpy Pro License

Thank you for purchasing SpineSpy Pro! Here's your license key:

${licenseKey}

How to Activate:
1. Open SpineSpy from your menubar
2. Click "Enter License"
3. Paste your license key
4. Enjoy SpineSpy Pro on up to 3 Macs

Pro Features Unlocked:
- Floating pet companion
- Custom sound clips
- Phone distraction nudges

Questions? Reply to this email or visit ${PRODUCTION_SITE_URL}

You have 14 days for a full refund, no questions asked.
  `.trim();

  try {
    await resend.emails.send({
      from: LICENSE_FROM_EMAIL,
      to: email,
      subject: "Your SpineSpy Pro License",
      html,
      text,
    });
  } catch (error) {
    console.error("Failed to send license email:", error);
    throw error;
  }
}
