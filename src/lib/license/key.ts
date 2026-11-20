import { randomInt } from "node:crypto";

/** No 0/O or 1/I, so keys survive being read aloud or retyped. */
const KEY_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const GROUPS = 3;
const GROUP_LENGTH = 4;

/** Accepts any uppercase letter or digit so hand-made test keys (e.g. SPY-TEST-0000-0001) still parse. */
const KEY_PATTERN = /^SPY-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;

/**
 * SPY-XXXX-XXXX-XXXX from a CSPRNG. `randomInt` has no modulo bias.
 * 12 characters from 32 symbols = 60 bits of entropy.
 */
export function generateLicenseKey(): string {
  const groups: string[] = [];
  for (let g = 0; g < GROUPS; g++) {
    let group = "";
    for (let i = 0; i < GROUP_LENGTH; i++) {
      group += KEY_ALPHABET[randomInt(KEY_ALPHABET.length)];
    }
    groups.push(group);
  }
  return `SPY-${groups.join("-")}`;
}

/** Trims and uppercases user input. Returns null when it is not a key. */
export function normalizeLicenseKey(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const key = input.trim().toUpperCase();
  return KEY_PATTERN.test(key) ? key : null;
}
