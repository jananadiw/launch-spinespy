import { randomUUID } from "node:crypto";
import type { EmailProvider } from "../types";
import { renderLicenseEmail, type RenderedEmail } from "../email-template";

/**
 * Mock email: logs to the server console and keeps an outbox that
 * /dev/emails lists. Nothing leaves the machine.
 */

export interface MockEmail extends RenderedEmail {
  id: string;
  to: string;
  key: string;
  sentAt: Date;
}

const MAX_OUTBOX = 50;

const globalForOutbox = globalThis as unknown as {
  __spinespyMockOutbox?: MockEmail[];
};

function outbox(): MockEmail[] {
  globalForOutbox.__spinespyMockOutbox ??= [];
  return globalForOutbox.__spinespyMockOutbox;
}

/** Newest first. */
export function listMockEmails(): MockEmail[] {
  return [...outbox()].reverse();
}

export function clearMockEmails(): void {
  globalForOutbox.__spinespyMockOutbox = [];
}

export const mockEmailProvider: EmailProvider = {
  async sendLicenseEmail({ email, key }) {
    const rendered = renderLicenseEmail({ key });
    const box = outbox();
    box.push({ id: randomUUID(), to: email, key, sentAt: new Date(), ...rendered });
    if (box.length > MAX_OUTBOX) box.splice(0, box.length - MAX_OUTBOX);

    console.log(
      `[mock email] to=${email} subject="${rendered.subject}" key=${key} (see /dev/emails)`,
    );
  },
};
