import { ShoppingBag } from "lucide-react";

interface CheckoutFormProps {
  className?: string;
  formClassName?: string;
  label?: string;
  compact?: boolean;
}

/** Starts Stripe Checkout via POST (browser follows the 303 redirect). */
export function CheckoutForm({
  className = "btn-primary",
  formClassName = "inline",
  label = "Unlock Pro",
  compact = false,
}: CheckoutFormProps) {
  return (
    <form action="/api/checkout" method="POST" className={formClassName}>
      <button
        type="submit"
        className={`${className} ${compact ? "btn-compact" : ""} inline-flex items-center gap-2`}
      >
        <ShoppingBag
          className={compact ? "w-4 h-4" : "w-5 h-5"}
          aria-hidden="true"
        />
        {label}
      </button>
    </form>
  );
}
