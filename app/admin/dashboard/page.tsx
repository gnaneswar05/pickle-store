"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface DashboardStats {
  totalOrders: number;
  todayOrders: number;
  totalRevenue: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    todayOrders: 0,
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

  const handleLogout = () => {
    localStorage.removeItem("admin-token");
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 relat ive"></div>
            <h1 className="text-xl font-semibold text-gray-900">Kanvi Admin</h1>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors px-3 py-2 rounded-md hover:bg-gray-100"
          >
            Sign out
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Navigation */}
        <nav className="bg-white rounded-xl border border-gray-200/50 shadow-sm mb-8">
          <div className="px-6 py-4">
            <div className="flex gap-8">
              <Link
                href="/admin/dashboard"
                className="text-sm font-medium text-blue-600 border-b-2 border-blue-600 pb-2"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/products"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors pb-2"
              >
                Products
              </Link>
              <Link
                href="/admin/banners"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors pb-2"
              >
                Banners
              </Link>
              <Link
                href="/admin/orders"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors pb-2"
              >
                Orders
              </Link>
              <Link
                href="/admin/coupons"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors pb-2"
              >
                Coupons
              </Link>
              <Link
                href="/admin/taxes"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors pb-2"
              >
                Taxes
              </Link>
            </div>
          </div>
        </nav>

        {/* Dashboard Stats */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Overview
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-gray-200/50 p-6 animate-pulse"
                >
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl border border-gray-200/50 p-6 shadow-sm">
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  Total Orders
                </h3>
                <p className="text-3xl font-semibold text-gray-900">
                  {stats.totalOrders}
                </p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200/50 p-6 shadow-sm">
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  Today Orders
                </h3>
                <p className="text-3xl font-semibold text-gray-900">
                  {stats.todayOrders}
                </p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200/50 p-6 shadow-sm">
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  Total Revenue
                </h3>
                <p className="text-3xl font-semibold text-gray-900">
                  ₹{stats.totalRevenue}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200/50 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Link
                href="/admin/products/new"
                className="block w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors text-center"
              >
                Add Product
              </Link>
              <Link
                href="/admin/banners/new"
                className="block w-full bg-gray-900 text-white px-4 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors text-center"
              >
                Add Banner
              </Link>
              <Link
                href="/admin/coupons/new"
                className="block w-full bg-green-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors text-center"
              >
                Create Coupon
              </Link>
              <Link
                href="/admin/taxes"
                className="block w-full bg-amber-600 px-4 py-3 text-center font-medium text-white transition-colors hover:bg-amber-700 rounded-lg"
              >
                Manage Taxes
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200/50 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Activity
            </h3>
            <p className="text-gray-600 text-sm">No recent activity</p>
          </div>
        </div>
      </div>
    </div>
  );
}
