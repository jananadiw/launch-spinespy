import { afterEach, describe, expect, it, vi } from "vitest";
import { getSiteOrigin, isMockMode } from "./config";
import { ConfigError } from "./types";

afterEach(() => vi.unstubAllEnvs());

describe("isMockMode", () => {
  it("defaults to mocks outside Vercel Production", () => {
    vi.stubEnv("USE_MOCKS", "");
    vi.stubEnv("VERCEL_ENV", "preview");
    expect(isMockMode()).toBe(true);
  });

  it("defaults to real providers on Vercel Production", () => {
    vi.stubEnv("USE_MOCKS", "");
    vi.stubEnv("VERCEL_ENV", "production");
    expect(isMockMode()).toBe(false);
  });

  it("lets USE_MOCKS override either way", () => {
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("USE_MOCKS", "true");
    expect(isMockMode()).toBe(true);
    vi.stubEnv("VERCEL_ENV", "");
    vi.stubEnv("USE_MOCKS", "FALSE");
    expect(isMockMode()).toBe(false);
  });
});

describe("getSiteOrigin", () => {
  it("prefers NEXT_PUBLIC_SITE_URL without a trailing slash", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://www.spinespy.com/");
    expect(getSiteOrigin()).toBe("https://www.spinespy.com");
  });

  it("falls back to the production domain, then the preview URL", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("VERCEL_ENV", "production");
    expect(getSiteOrigin()).toBe("https://www.spinespy.com");
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("VERCEL_URL", "launch-spinespy-abc.vercel.app");
    expect(getSiteOrigin()).toBe("https://launch-spinespy-abc.vercel.app");
  });

  it("throws outside dev when nothing is set", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("VERCEL_ENV", "");
    vi.stubEnv("VERCEL_URL", "");
    vi.stubEnv("NODE_ENV", "production");
    expect(() => getSiteOrigin()).toThrow(ConfigError);
  });
});
