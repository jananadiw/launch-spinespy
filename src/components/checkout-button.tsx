"use client";

import { ShoppingBag } from "lucide-react";
import { useState } from "react";

interface CheckoutButtonProps {
  className?: string;
  label?: string;
  compact?: boolean;
}

export function CheckoutButton({
  className = "btn-primary",
  label = "Unlock Pro",
  compact = false,
}: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const data = await response.json();
        if (data.code === "STRIPE_NOT_CONFIGURED") {
          window.location.href = "/pricing";
          return;
        }
        throw new Error(data.error || "Checkout failed");
      }

      // The API will redirect, but handle it manually if needed
      if (response.redirected) {
        window.location.href = response.url;
      } else {
        const data = await response.json();
        if (data.url) {
          window.location.href = data.url;
        }
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Unable to start checkout. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`${className} ${compact ? "btn-compact" : ""}`}
    >
      <ShoppingBag className={compact ? "w-4 h-4" : "w-5 h-5"} aria-hidden="true" />
      {isLoading ? "Loading..." : label}
    </button>
  );
}
