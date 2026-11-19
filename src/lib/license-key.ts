import nacl from "tweetnacl";

const LICENSE_KEY_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** Cryptographically secure license key: XXXX-XXXX-XXXX-XXXX (no ambiguous chars). */
export function generateLicenseKey(): string {
  const segments = 4;
  const segmentLength = 6;
  const result: string[] = [];

  for (let i = 0; i < segments; i++) {
    let segment = "";
    const bytes = nacl.randomBytes(segmentLength);
    for (let j = 0; j < segmentLength; j++) {
      segment += LICENSE_KEY_CHARS[bytes[j] % LICENSE_KEY_CHARS.length];
    }
    result.push(segment);
  }

  return result.join("-");
}
