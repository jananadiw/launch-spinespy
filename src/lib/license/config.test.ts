import { afterEach, describe, expect, it, vi } from "vitest";
import { isMockMode } from "./config";

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
