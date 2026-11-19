import { describe, expect, it } from "vitest";
import { generateLicenseKey } from "./license-key";

describe("generateLicenseKey", () => {
  it("matches XXXX-XXXX-XXXX-XXXX format", () => {
    const key = generateLicenseKey();
    expect(key).toMatch(/^[A-Z0-9]{6}(-[A-Z0-9]{6}){3}$/);
  });

  it("generates distinct keys", () => {
    const keys = new Set(Array.from({ length: 20 }, () => generateLicenseKey()));
    expect(keys.size).toBe(20);
  });
});
