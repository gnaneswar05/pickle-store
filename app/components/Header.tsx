"use client";

import { useAuth, useCart } from "@/app/store/useStore";
import FallbackImage from "@/app/components/FallbackImage";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const { isAuthenticated, user, clearAuth } = useAuth();
  const { getItemCount, clearCart } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const itemCount = getItemCount();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  const handleLogout = () => {
    clearCart();
    clearAuth();
    setMobileMenuOpen(false);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[rgba(255,250,243,0.88)] backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-3 lg:px-8">
        <div className="flex items-center justify-between gap-3">
        <Link href="/" className="group flex min-w-0 items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-[rgba(215,163,71,0.35)] blur-md transition group-hover:scale-110" />
            <FallbackImage
              src="/logo.jpeg"
              alt="Kanvi logo"
              width={44}
              height={44}
              className="relative rounded-full border border-white/70 shadow-md"
              fallbackSrc="/logo.jpeg"
            />
          </div>
          <div className="min-w-0">
            <p className="hidden text-[11px] font-semibold uppercase tracking-[0.35em] text-[var(--olive)] sm:block">
              Small Batch Pickles
            </p>
            <p className="truncate text-lg font-semibold text-[var(--brand-deep)] sm:text-xl">
              Kanvi
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {[
            { href: "/", label: "Home" },
            { href: "/products", label: "Shop" },
            { href: "/orders", label: "Orders" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-stone-700 hover:bg-white hover:text-[var(--brand-deep)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/cart"
            className="relative rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm font-semibold text-[var(--brand-deep)] shadow-sm hover:-translate-y-0.5"
          >
            Cart
            {itemCount > 0 ? (
              <span className="ml-2 inline-flex min-w-6 items-center justify-center rounded-full bg-[var(--brand)] px-1.5 py-0.5 text-xs text-white">
                {itemCount}
              </span>
            ) : null}
          </Link>

          {isAuthenticated() ? (
            <div className="flex items-center gap-2">
              <div className="hidden rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm text-stone-700 lg:block">
                {user?.phone}
              </div>
              <button
                onClick={handleLogout}
                className="rounded-full bg-[var(--brand-deep)] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:-translate-y-0.5"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-stone-900 shadow-sm hover:-translate-y-0.5"
            >
              Sign in
            </Link>
          )}
        </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((current) => !current)}
            className="inline-flex rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm font-semibold text-[var(--brand-deep)] md:hidden"
          >
            {mobileMenuOpen ? "Close" : "Menu"}
          </button>
        </div>

        <div className="mt-3 flex items-center gap-2 md:hidden">
          <Link
            href="/cart"
            className="relative flex-1 rounded-full border border-[var(--line)] bg-white px-4 py-2 text-center text-sm font-semibold text-[var(--brand-deep)] shadow-sm"
            onClick={() => setMobileMenuOpen(false)}
          >
            Cart
            {itemCount > 0 ? (
              <span className="ml-2 inline-flex min-w-6 items-center justify-center rounded-full bg-[var(--brand)] px-1.5 py-0.5 text-xs text-white">
                {itemCount}
              </span>
            ) : null}
          </Link>
          {isAuthenticated() ? (
            <button
              onClick={handleLogout}
              className="rounded-full bg-[var(--brand-deep)] px-4 py-2 text-sm font-semibold text-white shadow-sm"
            >
              Sign out
            </button>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-stone-900 shadow-sm"
            >
              Sign in
            </Link>
          )}
        </div>

        {mobileMenuOpen ? (
          <nav className="mt-3 grid gap-2 rounded-3xl border border-[var(--line)] bg-white/90 p-3 md:hidden">
            {[
              { href: "/", label: "Home" },
              { href: "/products", label: "Shop" },
              { href: "/orders", label: "Orders" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm font-medium text-stone-700 hover:bg-[var(--surface)] hover:text-[var(--brand-deep)]"
              >
                {item.label}
              </Link>
            ))}
            {isAuthenticated() ? (
              <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm text-stone-700">
                Logged in as {user?.phone}
              </div>
            ) : null}
          </nav>
        ) : null}
      </div>
    </header>
  );
}
