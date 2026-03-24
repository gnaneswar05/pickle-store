"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Customer {
  _id: string;
  phone: string;
  isVerified: boolean;
  createdAt: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string | null;
}

export default function AdminCustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCustomers, setTotalCustomers] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("admin-token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    const fetchCustomers = async () => {
      try {
        const res = await fetch(`/api/admin/customers?page=${page}&limit=10`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch customers");
        }

        setCustomers(data.data.customers || []);
        setTotalPages(data.data.totalPages || 1);
        setTotalCustomers(data.data.total || 0);
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [page, router]);

  const handleExport = async () => {
    try {
      const res = await fetch("/api/admin/customers/export", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to export customers");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "customers-export.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting customers:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin-token");
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200/50 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <h1 className="text-xl font-semibold text-gray-900">Kanvi Admin</h1>
          <button
            onClick={handleLogout}
            className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            Sign out
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <nav className="mb-8 rounded-xl border border-gray-200/50 bg-white shadow-sm">
          <div className="flex gap-8 px-6 py-4">
            <Link href="/admin/dashboard" className="pb-2 text-sm font-medium text-gray-600 hover:text-gray-900">
              Dashboard
            </Link>
            <Link href="/admin/products" className="pb-2 text-sm font-medium text-gray-600 hover:text-gray-900">
              Products
            </Link>
            <Link href="/admin/banners" className="pb-2 text-sm font-medium text-gray-600 hover:text-gray-900">
              Banners
            </Link>
            <Link href="/admin/orders" className="pb-2 text-sm font-medium text-gray-600 hover:text-gray-900">
              Orders
            </Link>
            <Link href="/admin/customers" className="border-b-2 border-blue-600 pb-2 text-sm font-medium text-blue-600">
              Customers
            </Link>
            <Link href="/admin/coupons" className="pb-2 text-sm font-medium text-gray-600 hover:text-gray-900">
              Coupons
            </Link>
            <Link href="/admin/taxes" className="pb-2 text-sm font-medium text-gray-600 hover:text-gray-900">
              Taxes
            </Link>
            <Link href="/admin/settings" className="pb-2 text-sm font-medium text-gray-600 hover:text-gray-900">
              Settings
            </Link>
          </div>
        </nav>

        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Customers</h2>
            <p className="mt-2 text-sm text-gray-600">
              Total customers: {totalCustomers}
            </p>
          </div>
          <button
            type="button"
            onClick={handleExport}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Export Customers
          </button>
        </div>

        {loading ? (
          <div className="rounded-xl border border-gray-200/50 bg-white p-10 text-center text-gray-600 shadow-sm">
            Loading customers...
          </div>
        ) : customers.length > 0 ? (
          <>
            <div className="overflow-x-auto rounded-xl border border-gray-200/50 bg-white shadow-sm">
              <table className="w-full">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Mobile Number
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Verified
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Orders
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Total Spent
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Last Order
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer._id} className="border-b last:border-b-0 hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {customer.phone}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {customer.isVerified ? "Verified" : "Pending"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {customer.totalOrders}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        Rs. {customer.totalSpent.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {customer.lastOrderDate
                          ? new Date(customer.lastOrderDate).toLocaleDateString()
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-xl border border-gray-200/50 bg-white px-6 py-4 shadow-sm">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(current - 1, 1))}
                disabled={page <= 1}
                className="rounded border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 disabled:opacity-50"
              >
                Previous
              </button>
              <p className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </p>
              <button
                type="button"
                onClick={() =>
                  setPage((current) => Math.min(current + 1, totalPages))
                }
                disabled={page >= totalPages}
                className="rounded border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <div className="rounded-xl border border-gray-200/50 bg-white p-10 text-center text-gray-600 shadow-sm">
            No customers yet.
          </div>
        )}
      </div>
    </div>
  );
}
