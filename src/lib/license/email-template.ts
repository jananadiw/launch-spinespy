import { DOWNLOAD_URL, MAX_ACTIVATIONS, PRODUCTION_SITE_URL, SUPPORT_EMAIL } from "@/lib/site";

export interface RenderedEmail {
  subject: string;
  text: string;
  html: string;
}

/**
 * License email content, shared by the mock outbox and the Phase 2 Resend sender,
 * so the mock shows the copy buyers will get.
 *
 * TODO(phase2): Replace the HTML with the branded layout (paper background,
 * Newsreader heading, ink button). Keep the same three parts: key, download link,
 * activation steps.
 */
export function renderLicenseEmail({ key }: { key: string }): RenderedEmail {
  const restoreUrl = `${PRODUCTION_SITE_URL}/restore`;
  const steps = [
    "Download SpineSpy and move it to Applications.",
    "Open SpineSpy from the menu bar.",
    "Choose Enter License and paste your key.",
  ];

  const text = [
    "Thanks for buying SpineSpy.",
    "",
    "Your license key:",
    "",
    `    ${key}`,
    "",
    `Download SpineSpy: ${DOWNLOAD_URL}`,
    "",
    "To activate:",
    ...steps.map((s, i) => `${i + 1}. ${s}`),
    "",
    `Your key works on up to ${MAX_ACTIVATIONS} Macs. Keep this email; it is the only copy of your key.`,
    `Lost it? Get it resent at ${restoreUrl}`,
    "",
    `Questions: ${SUPPORT_EMAIL}`,
  ].join("\n");

  const html = `<!doctype html>
<html>
<body style="margin:0;padding:24px;background:#f3f0ea;color:#1c1916;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;line-height:1.6;">
  <div style="max-width:560px;margin:0 auto;background:#faf8f4;border-radius:12px;padding:32px;">
    <h1 style="margin:0 0 16px;font-family:Georgia,serif;font-size:26px;font-weight:600;">Thanks for buying SpineSpy</h1>
    <p style="margin:0 0 8px;">Your license key:</p>
    <p style="margin:0 0 24px;padding:16px;border:1px solid rgba(28,25,22,0.12);border-radius:8px;background:#fff;font-family:Menlo,Monaco,monospace;font-size:20px;font-weight:600;letter-spacing:1px;text-align:center;">${key}</p>
    <p style="margin:0 0 24px;"><a href="${DOWNLOAD_URL}" style="display:inline-block;padding:12px 18px;border-radius:13px;background:#1c1916;color:#f3f0ea;font-weight:600;text-decoration:none;">Download SpineSpy</a></p>
    <p style="margin:0 0 8px;font-weight:600;">To activate</p>
    <ol style="margin:0 0 24px;padding-left:20px;">
      ${steps.map((s) => `<li>${s}</li>`).join("\n      ")}
    </ol>
    <p style="margin:0 0 8px;color:#5e5852;font-size:14px;">Your key works on up to ${MAX_ACTIVATIONS} Macs. Keep this email; it is the only copy of your key. Lost it? <a href="${restoreUrl}" style="color:#1c1916;">Get it resent</a>.</p>
    <p style="margin:0;color:#5e5852;font-size:14px;">Questions: <a href="mailto:${SUPPORT_EMAIL}" style="color:#1c1916;">${SUPPORT_EMAIL}</a></p>
  </div>
</body>
</html>`;

  return { subject: "Your SpineSpy license key", text, html };
}
