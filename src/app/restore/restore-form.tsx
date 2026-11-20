"use client";

import { useState, type FormEvent } from "react";
import { Loader2, Send } from "lucide-react";
import { RESEND_MESSAGE } from "@/lib/license/copy";

type State =
  | { kind: "idle" }
  | { kind: "pending" }
  | { kind: "done"; message: string }
  | { kind: "error"; message: string };

export function RestoreForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>({ kind: "idle" });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ kind: "pending" });
    try {
      const response = await fetch("/api/license/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data: { message?: string; error?: string } = await response.json().catch(() => ({}));

      if (response.status === 429) {
        setState({ kind: "error", message: "Too many requests. Wait a minute and try again." });
      } else if (!response.ok) {
        setState({ kind: "error", message: data.error || "Something went wrong. Please try again." });
      } else {
        setState({ kind: "done", message: data.message || RESEND_MESSAGE });
      }
    } catch {
      setState({ kind: "error", message: "Something went wrong. Please try again." });
    }
  }

  const pending = state.kind === "pending";

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="restore-email" className="mb-2 block text-sm font-medium">
        Email
      </label>
      <input
        id="restore-email"
        type="email"
        name="email"
        required
        autoComplete="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="text-input mb-4"
      />
      <button
        type="submit"
        disabled={pending}
        aria-busy={pending}
        className="btn-primary disabled:cursor-wait disabled:opacity-80"
      >
        {pending ? (
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
        ) : (
          <Send className="h-5 w-5" aria-hidden="true" />
        )}
        Resend my key
      </button>

      <p aria-live="polite" role="status" className="mt-6 min-h-6 text-[var(--ink-muted)]">
        {state.kind === "done" || state.kind === "error" ? state.message : ""}
      </p>
    </form>
  );
}
