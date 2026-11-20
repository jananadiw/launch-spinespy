"use client";

import { useState } from "react";
import { Loader2, ShoppingBag } from "lucide-react";
import { SPINESPY_PRICE_USD } from "@/lib/site";

export const BUY_LABEL = `Buy SpineSpy, $${SPINESPY_PRICE_USD.toFixed(2)}`;

interface BuyButtonProps {
  className?: string;
  label?: string;
  compact?: boolean;
  /** Tailwind classes for the error line. Dark panels need a light color. */
  errorClassName?: string;
}

/** POSTs /api/checkout, then sends the browser to the returned URL. */
export function BuyButton({
  className = "btn-primary",
  label = BUY_LABEL,
  compact = false,
  errorClassName = "text-[var(--ink-muted)]",
}: BuyButtonProps) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startCheckout() {
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      });
      const data: { url?: string; error?: string } = await response.json().catch(() => ({}));
      if (!response.ok || !data.url) {
        throw new Error(data.error || "Checkout is unavailable. Please try again.");
      }
      window.location.assign(data.url);
      // Keep the spinner while the browser navigates away.
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout is unavailable. Please try again.");
      setPending(false);
    }
  }

  const iconClass = compact ? "w-4 h-4" : "w-5 h-5";

  return (
    <>
      <button
        type="button"
        onClick={startCheckout}
        disabled={pending}
        aria-busy={pending}
        className={`${className} ${compact ? "btn-compact" : ""} disabled:cursor-wait disabled:opacity-80`}
      >
        {pending ? (
          <Loader2 className={`${iconClass} animate-spin`} aria-hidden="true" />
        ) : (
          <ShoppingBag className={iconClass} aria-hidden="true" />
        )}
        {label}
      </button>
      {error && (
        <p role="alert" className={`mt-2 w-full text-sm ${errorClassName}`}>
          {error}
        </p>
      )}
    </>
  );
}
