import Link from "next/link";

/** Nav + paper background used by the small standalone pages (thanks, restore, dev). */
export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen relative bg-[var(--paper)]">
      <div className="noise-overlay" aria-hidden="true" />

      <header className="site-nav">
        <div className="container-wide py-4 sm:py-5">
          <Link href="/" className="font-semibold text-lg tracking-tight">
            SpineSpy
          </Link>
        </div>
      </header>

      <section className="pt-28 pb-16 sm:pt-36 sm:pb-20">{children}</section>
    </main>
  );
}
