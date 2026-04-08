"use client";

import { useAuth, useCart } from "@/app/store/useStore";
import FallbackImage from "@/app/components/FallbackImage";
import useSiteSettings from "@/app/components/useSiteSettings";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const { isAuthenticated, user, clearAuth } = useAuth();
  const { getItemCount, clearCart } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const siteSettings = useSiteSettings();
  const itemCount = getItemCount();
  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/products", label: "Shop" },
    { href: "/orders", label: "Orders" },
  ];

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

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
                src={siteSettings.logoUrl}
                alt={`${siteSettings.brandName} logo`}
                width={44}
                height={44}
                className="relative rounded-full border border-white/70 shadow-md"
                fallbackSrc="/logo.jpeg"
              />
            </div>
            <div className="min-w-0">
              <p className="hidden text-[11px] font-semibold uppercase tracking-[0.35em] text-[var(--olive)] sm:block">
                {siteSettings.brandTagline}
              </p>
              <p className="truncate text-lg font-semibold text-[var(--brand-deep)] sm:text-xl">
                {siteSettings.brandName}
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 rounded-full border border-[var(--line)] bg-white/70 p-1 shadow-sm md:flex">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-2 text-sm font-medium ${
                    isActive
                      ? "bg-[var(--brand-deep)] text-white"
                      : "text-stone-700 hover:bg-white hover:text-[var(--brand-deep)]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
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
                  {user?.name || user?.phone}
                </div>
                <Link
                  href="/account"
                  className="rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm font-semibold text-[var(--brand-deep)] shadow-sm hover:-translate-y-0.5"
                >
                  Account
                </Link>
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

          <div className="flex items-center gap-3 md:hidden">
            <Link
              href="/cart"
              className="relative inline-flex items-center justify-center rounded-full border border-[var(--line)] bg-white px-3 py-2 text-sm font-semibold text-[var(--brand-deep)] shadow-sm"
            >
              Cart
              {itemCount > 0 ? (
                <span className="ml-1.5 inline-flex min-w-5 items-center justify-center rounded-full bg-[var(--brand)] px-1 py-0.5 text-[10px] text-white">
                  {itemCount}
                </span>
              ) : null}
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((current) => !current)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] bg-white text-[var(--brand-deep)] shadow-sm"
            >
              <span className="relative h-4 w-5">
                <span
                  className={`absolute left-0 top-0 h-0.5 w-5 rounded-full bg-current transition ${
                    mobileMenuOpen ? "translate-y-[7px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`absolute left-0 top-[7px] h-0.5 w-5 rounded-full bg-current transition ${
                    mobileMenuOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`absolute left-0 top-[14px] h-0.5 w-5 rounded-full bg-current transition ${
                    mobileMenuOpen ? "-translate-y-[7px] -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </div>

        <div
          className={`overflow-hidden transition-[max-height,opacity] duration-300 md:hidden ${
            mobileMenuOpen
              ? "mt-4 max-h-[32rem] opacity-100"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="rounded-[30px] border border-[var(--line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,248,240,0.94))] p-4 shadow-[0_24px_70px_rgba(92,60,37,0.16)] animate-[menu-rise_.28s_ease-out]">
            <div className="rounded-[24px] bg-[linear-gradient(135deg,rgba(109,36,16,0.96),rgba(159,63,35,0.9),rgba(215,163,71,0.84))] p-4 text-white">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-amber-100/85">
                Quick Access
              </p>
              <p className="mt-2 text-lg font-semibold">
                Browse jars, check orders, and jump back into your cart.
              </p>
            </div>

            <nav className="mt-4 grid gap-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between rounded-[22px] px-4 py-3 text-sm font-medium ${
                      isActive
                        ? "bg-[var(--brand-deep)] text-white"
                        : "bg-white text-stone-700 hover:bg-[var(--surface)] hover:text-[var(--brand-deep)]"
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="text-xs uppercase tracking-[0.24em] opacity-70">
                      Open
                    </span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {isAuthenticated() ? (
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-[22px] border border-[var(--line)] bg-white px-4 py-3 text-center text-sm font-semibold text-[var(--brand-deep)]"
                >
                  Account
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="col-span-2 rounded-[22px] bg-[var(--accent)] px-4 py-3 text-center text-sm font-semibold text-stone-900"
                >
                  Sign in or Create Account
                </Link>
              )}
              {isAuthenticated() ? (
                <button
                  onClick={handleLogout}
                  className="rounded-[22px] bg-[var(--brand-deep)] px-4 py-3 text-sm font-semibold text-white"
                >
                  Sign out
                </button>
              ) : null}
            </div>

            {isAuthenticated() ? (
              <div className="mt-4 rounded-[22px] border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm text-stone-700">
                Logged in as {user?.name || user?.phone}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
