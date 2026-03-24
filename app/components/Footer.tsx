"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="mt-20 border-t border-[var(--line)] bg-[rgba(255,250,243,0.9)]">
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div className="rounded-[28px] border border-[var(--line)] bg-white/70 p-6 shadow-[0_14px_45px_rgba(92,60,37,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--olive)]">
              Kanvi Pantry Notes
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-[var(--brand-deep)]">
              Bold jars, hand-ground masalas, and recipes that taste like home.
            </h3>
            <p className="mt-3 max-w-xl text-sm leading-6 text-stone-600">
              We make small-batch pickles with real spice, real oil, and no
              factory feel. Every order is packed like it is headed to family.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--brand)]">
              Explore
            </h4>
            <div className="mt-5 flex flex-col gap-3 text-sm text-stone-700">
              <Link href="/" className="hover:text-[var(--brand-deep)]">
                Home
              </Link>
              <Link href="/products" className="hover:text-[var(--brand-deep)]">
                Products
              </Link>
              <Link href="/cart" className="hover:text-[var(--brand-deep)]">
                Cart
              </Link>
              <Link href="/orders" className="hover:text-[var(--brand-deep)]">
                Orders
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--brand)]">
              Contact
            </h4>
            <div className="mt-5 flex flex-col gap-3 text-sm text-stone-700">
              <a href="mailto:hello@kanvi.com" className="hover:text-[var(--brand-deep)]">
                hello@kanvi.com
              </a>
              <p>Crafted for everyday meals and gift-worthy jars.</p>
              <p className="text-stone-500">Fresh batches. Fast dispatch.</p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-[var(--line)] pt-6 text-sm text-stone-500 md:flex-row md:items-center md:justify-between">
          <p>© 2026 Kanvi. Homemade taste, packed with care.</p>
          <p>Designed for quick shopping, clear updates, and a stronger brand feel.</p>
        </div>
      </div>
    </footer>
  );
}
