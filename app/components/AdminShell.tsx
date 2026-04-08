"use client";

import FallbackImage from "@/app/components/FallbackImage";
import useSiteSettings from "@/app/components/useSiteSettings";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const navSections = [
  {
    label: "Overview",
    items: [{ href: "/admin/dashboard", label: "Dashboard" }],
  },
  {
    label: "Catalog",
    items: [
      { href: "/admin/products", label: "Products" },
      { href: "/admin/banners", label: "Homepage Banners" },
      { href: "/admin/coupons", label: "Coupons" },
    ],
  },
  {
    label: "Operations",
    items: [
      { href: "/admin/orders", label: "Orders" },
      { href: "/admin/customers", label: "Customers" },
    ],
  },
  {
    label: "Configuration",
    items: [
      { href: "/admin/taxes", label: "Taxes & Charges" },
      { href: "/admin/settings", label: "Brand Settings" },
    ],
  },
];

interface AdminShellProps {
  activeHref: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

function getCurrentSectionLabel(activeHref: string) {
  for (const section of navSections) {
    if (section.items.some((item) => item.href === activeHref)) {
      return section.label;
    }
  }

  return "Admin";
}

export default function AdminShell({
  activeHref,
  title,
  subtitle,
  actions,
  children,
}: AdminShellProps) {
  const router = useRouter();
  const siteSettings = useSiteSettings();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const currentSectionLabel = useMemo(
    () => getCurrentSectionLabel(activeHref),
    [activeHref],
  );

  const signOut = () => {
    localStorage.removeItem("admin-token");
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8f4ec_0%,#f3eee6_100%)] text-slate-900">
      <div className="flex min-h-screen w-full gap-0">
        <aside className="hidden w-[300px] shrink-0 lg:block">
          <div className="sticky top-0 min-h-screen overflow-hidden border-r border-[#e9decf] bg-[linear-gradient(180deg,#fffdf9_0%,#f8f1e7_100%)] shadow-[0_24px_70px_rgba(79,55,32,0.10)]">
            <div className="border-b border-[#eadfce] px-6 py-6">
              <Link href="/admin/dashboard" className="flex items-center gap-4">
                <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-white/70 bg-white shadow-sm">
                  <FallbackImage
                    src={siteSettings.logoUrl}
                    alt={`${siteSettings.brandName} logo`}
                    fill
                    className="object-cover"
                    fallbackSrc="/logo.jpeg"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#9b6b3f]">
                    Control Room
                  </p>
                  <h1 className="truncate text-xl font-semibold text-[#3f2516]">
                    {siteSettings.brandName} Admin
                  </h1>
                </div>
              </Link>
            </div>

            <div className="space-y-6 px-4 py-5">
              {navSections.map((section) => (
                <div key={section.label}>
                  <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
                    {section.label}
                  </p>
                  <div className="mt-3 space-y-1.5">
                    {section.items.map((item) => {
                      const isActive = item.href === activeHref;

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition ${
                            isActive
                              ? "bg-[#3b2317] text-white shadow-[0_12px_28px_rgba(59,35,23,0.22)]"
                              : "text-slate-600 hover:bg-white hover:text-[#3b2317]"
                          }`}
                        >
                          <span>{item.label}</span>
                          <span
                            className={`text-[10px] uppercase tracking-[0.24em] ${
                              isActive ? "text-amber-100/80" : "text-slate-400"
                            }`}
                          >
                            Open
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-[#eadfce] bg-white/70 px-5 py-5">
              <div className="rounded-[24px] bg-[linear-gradient(135deg,#4d2d1b_0%,#8f4d27_100%)] p-4 text-white">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-100/80">
                  Going Live
                </p>
                <p className="mt-2 text-sm leading-6 text-stone-100/90">
                  Keep this panel clean, fast, and trustworthy. Admin quality
                  directly affects customer confidence.
                </p>
                <button
                  type="button"
                  onClick={signOut}
                  className="mt-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#4d2d1b]"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="border-b border-[#eadfce] bg-[rgba(255,253,249,0.92)] px-4 py-4 shadow-[0_20px_55px_rgba(79,55,32,0.08)] backdrop-blur-xl sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#9b6b3f]">
                    {currentSectionLabel}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-[#342014] md:text-3xl">
                    {title}
                  </h2>
                  {subtitle ? (
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                      {subtitle}
                    </p>
                  ) : null}
                </div>

                <div className="flex shrink-0 items-center gap-2 lg:hidden">
                  <button
                    type="button"
                    onClick={() => setMobileNavOpen((current) => !current)}
                    className="rounded-full border border-[#ddcfbb] bg-white px-4 py-2 text-sm font-semibold text-[#3b2317]"
                  >
                    {mobileNavOpen ? "Close menu" : "Open menu"}
                  </button>
                </div>
              </div>

              {mobileNavOpen ? (
                <div className="grid gap-4 rounded-[24px] border border-[#eadfce] bg-[#fffaf3] p-4 lg:hidden">
                  {navSections.map((section) => (
                    <div key={section.label}>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
                        {section.label}
                      </p>
                      <div className="mt-2 grid gap-2 sm:grid-cols-2">
                        {section.items.map((item) => {
                          const isActive = item.href === activeHref;

                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setMobileNavOpen(false)}
                              className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
                                isActive
                                  ? "bg-[#3b2317] text-white"
                                  : "border border-[#eadfce] bg-white text-slate-700"
                              }`}
                            >
                              {item.label}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              {actions ? (
                <div className="flex flex-wrap gap-3">{actions}</div>
              ) : null}
            </div>
          </header>

          <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
