"use client";

import AdminShell from "@/app/components/AdminShell";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface DashboardStats {
  totalOrders: number;
  todayOrders: number;
  totalCustomers: number;
  totalRevenue: number;
}

const quickActions = [
  {
    href: "/admin/products/new",
    label: "Add Product",
    description: "Create a new product card with image, price, and visibility.",
    tone: "bg-[#3b2317] text-white",
  },
  {
    href: "/admin/banners/new",
    label: "Add Banner",
    description: "Update the homepage carousel with a fresh campaign visual.",
    tone: "bg-[#c96f2d] text-white",
  },
  {
    href: "/admin/orders",
    label: "Review Orders",
    description: "Check live orders, update status, and verify dispatch flow.",
    tone: "bg-[#f3e5d4] text-[#3b2317]",
  },
  {
    href: "/admin/settings",
    label: "Brand Settings",
    description: "Manage logo, brand details, and delivery coverage settings.",
    tone: "bg-[#e8f0e5] text-[#314327]",
  },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    todayOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("admin-token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch dashboard stats");
        }

        setStats(data.data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [router]);

  const statCards = [
    {
      label: "Total Orders",
      value: stats.totalOrders,
      note: "All completed and in-progress orders",
    },
    {
      label: "Orders Today",
      value: stats.todayOrders,
      note: "Fresh demand coming in today",
    },
    {
      label: "Customers",
      value: stats.totalCustomers,
      note: "Verified and returning buyers",
    },
    {
      label: "Revenue",
      value: `Rs. ${stats.totalRevenue}`,
      note: "Current lifetime sales total",
    },
  ];

  return (
    <AdminShell
      activeHref="/admin/dashboard"
      title="Store Dashboard"
      subtitle="A tighter operational overview for launch mode, with clear next actions and cleaner hierarchy."
    >
      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <section className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
            {(loading ? Array.from({ length: 4 }) : statCards).map(
              (card, index) => (
                <div
                  key={loading ? index : card.label}
                  className="rounded-[28px] border border-[#eadfce] bg-[linear-gradient(180deg,#fffdf9_0%,#fff6ec_100%)] p-5 shadow-[0_16px_45px_rgba(79,55,32,0.08)]"
                >
                  {loading ? (
                    <div className="space-y-3 animate-pulse">
                      <div className="h-3 w-24 rounded bg-[#ece2d4]" />
                      <div className="h-9 w-28 rounded bg-[#ece2d4]" />
                      <div className="h-3 w-full rounded bg-[#f3ebdf]" />
                    </div>
                  ) : (
                    <>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#9b6b3f]">
                        {card.label}
                      </p>
                      <p className="mt-4 text-4xl font-semibold text-[#2f1b12]">
                        {card.value}
                      </p>
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {card.note}
                      </p>
                    </>
                  )}
                </div>
              ),
            )}
          </div>

          <div className="rounded-[32px] border border-[#eadfce] bg-white/90 p-6 shadow-[0_16px_45px_rgba(79,55,32,0.08)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#9b6b3f]">
                  Launch Checklist
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-[#2f1b12]">
                  Keep the storefront sharp before traffic starts.
                </h3>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                "Use fewer but stronger homepage banners so the hero feels intentional.",
                "Make product cards consistent in image quality, copy length, and pricing rhythm.",
                "Check order, settings, and checkout states on mobile before going live.",
              ].map((item, index) => (
                <div
                  key={item}
                  className="rounded-[24px] bg-[#fbf6ef] p-4"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                    Step 0{index + 1}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="rounded-[32px] border border-[#eadfce] bg-[linear-gradient(180deg,#fffdf9_0%,#fff6ec_100%)] p-6 shadow-[0_16px_45px_rgba(79,55,32,0.08)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#9b6b3f]">
              Quick Actions
            </p>
            <div className="mt-5 space-y-3">
              {quickActions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className={`block rounded-[24px] px-5 py-4 shadow-sm transition hover:-translate-y-0.5 ${action.tone}`}
                >
                  <p className="text-base font-semibold">{action.label}</p>
                  <p className="mt-1 text-sm leading-6 opacity-85">
                    {action.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-[#eadfce] bg-[#2f1b12] p-6 text-white shadow-[0_16px_45px_rgba(79,55,32,0.16)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-100/80">
              Design Direction
            </p>
            <p className="mt-4 text-sm leading-7 text-stone-100/88">
              The admin now needs to feel lighter, more premium, and more
              structured than the current utility UI. Clean spacing, grouped
              actions, and strong card hierarchy help it feel ready for live use.
            </p>
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
