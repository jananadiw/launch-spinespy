import { createLicense, getLicenseBySessionId } from "./license";
import { sendLicenseEmail } from "./email";

export async function fulfillOrder(sessionId: string, email: string): Promise<string> {
  const existingLicense = await getLicenseBySessionId(sessionId);
  
  if (existingLicense) {
    return existingLicense.key;
  }

  const license = await createLicense(sessionId, email);

  try {
    await sendLicenseEmail(email, license.key);
  } catch (error) {
    console.error("Failed to send license email, but license was created:", error);
  }

  return license.key;
}
