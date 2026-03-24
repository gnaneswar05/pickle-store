"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/banners", label: "Banners" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/coupons", label: "Coupons" },
  { href: "/admin/taxes", label: "Taxes" },
  { href: "/admin/settings", label: "Settings" },
];

interface AdminShellProps {
  activeHref: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export default function AdminShell({
  activeHref,
  title,
  subtitle,
  actions,
  children,
}: AdminShellProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200/50 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <h1 className="text-xl font-semibold text-gray-900">Kanvi Admin</h1>
          <button
            onClick={() => {
              localStorage.removeItem("admin-token");
              router.push("/admin/login");
            }}
            className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            Sign out
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <nav className="mb-8 rounded-xl border border-gray-200/50 bg-white shadow-sm">
          <div className="flex gap-8 overflow-x-auto px-6 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`pb-2 text-sm font-medium transition-colors ${
                  item.href === activeHref
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
            {subtitle ? (
              <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
            ) : null}
          </div>
          {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
        </div>

        {children}
      </div>
    </div>
  );
}
