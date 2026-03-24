"use client";

import { useAuth, useCart } from "@/app/store/useStore";
import FallbackImage from "@/app/components/FallbackImage";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const { isAuthenticated, user, clearAuth } = useAuth();
  const { getItemCount } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const itemCount = getItemCount();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  const handleLogout = () => {
    clearAuth();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[rgba(255,250,243,0.88)] backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link href="/" className="group flex items-center gap-3">
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
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[var(--olive)]">
              Small Batch Pickles
            </p>
            <p className="text-xl font-semibold text-[var(--brand-deep)]">
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

        <div className="flex items-center gap-3">
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
      </div>
    </header>
  );
}
