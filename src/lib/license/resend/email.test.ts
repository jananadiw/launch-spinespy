import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createResendEmailProvider } from "./email";

beforeEach(() => vi.stubEnv("LICENSE_FROM_EMAIL", "hello@spinespy.com"));
afterEach(() => vi.unstubAllEnvs());

function fakeResend(result: { data: unknown; error: unknown }) {
  const send = vi.fn().mockResolvedValue(result);
  return { client: { emails: { send } } as never, send };
}

describe("resend email provider", () => {
  it("sends the license email from SpineSpy", async () => {
    const { client, send } = fakeResend({ data: { id: "em_1" }, error: null });
    await createResendEmailProvider(() => client).sendLicenseEmail({
      email: "buyer@example.com",
      key: "SPY-ABCD-EFGH-JKLM",
    });
    const sent = send.mock.calls[0][0];
    expect(sent).toMatchObject({
      from: "SpineSpy <hello@spinespy.com>",
      to: "buyer@example.com",
      subject: "Your SpineSpy license key",
    });
    expect(sent.text).toContain("SPY-ABCD-EFGH-JKLM");
    expect(sent.html).toContain("SPY-ABCD-EFGH-JKLM");
  });

  it("throws when Resend returns an error", async () => {
    const { client } = fakeResend({ data: null, error: { name: "validation_error", message: "bad from" } });
    await expect(
      createResendEmailProvider(() => client).sendLicenseEmail({ email: "a@example.com", key: "SPY-A" }),
    ).rejects.toThrow("Resend failed: validation_error: bad from");
  });
});
