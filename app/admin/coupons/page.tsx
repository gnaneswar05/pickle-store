"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Coupon {
  _id: string;
  code: string;
  discountType: string;
  discountValue: number;
  expiryDate: string;
  usageLimit: number;
  usageCount: number;
  isActive: boolean;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("admin-token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    const fetchCoupons = async () => {
      try {
        const res = await fetch("/api/coupons", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch coupons");
        }

        setCoupons(data.data.coupons || []);
      } catch (error) {
        console.error("Error fetching coupons:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, [router]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;

    try {
      const res = await fetch(`/api/coupons/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
        },
      });

      if (res.ok) {
        setCoupons(coupons.filter((c) => c._id !== id));
      }
    } catch (error) {
      console.error("Error deleting coupon:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin-token");
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-purple-700 text-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Kanvi Admin</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <nav className="mb-8 bg-white rounded-lg shadow">
          <div className="px-6 py-4 flex gap-4 overflow-x-auto">
            <Link
              href="/admin/dashboard"
              className="text-gray-600 hover:text-purple-700"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/products"
              className="text-gray-600 hover:text-purple-700"
            >
              Products
            </Link>
            <Link
              href="/admin/banners"
              className="text-gray-600 hover:text-purple-700"
            >
              Banners
            </Link>
            <Link
              href="/admin/orders"
              className="text-gray-600 hover:text-purple-700"
            >
              Orders
            </Link>
            <Link
              href="/admin/coupons"
              className="text-purple-700 font-bold hover:text-purple-900"
            >
              Coupons
            </Link>
            <Link
              href="/admin/taxes"
              className="text-gray-600 hover:text-purple-700"
            >
              Taxes
            </Link>
          </div>
        </nav>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Coupons</h2>
          <Link
            href="/admin/coupons/new"
            className="bg-purple-700 text-white px-6 py-2 rounded hover:bg-purple-800"
          >
            Create Coupon
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : coupons.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left font-bold">Code</th>
                  <th className="px-6 py-3 text-left font-bold">Type</th>
                  <th className="px-6 py-3 text-left font-bold">Value</th>
                  <th className="px-6 py-3 text-left font-bold">Usage</th>
                  <th className="px-6 py-3 text-left font-bold">Expiry</th>
                  <th className="px-6 py-3 text-left font-bold">Status</th>
                  <th className="px-6 py-3 text-left font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr key={coupon._id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-3 font-bold">{coupon.code}</td>
                    <td className="px-6 py-3">{coupon.discountType}</td>
                    <td className="px-6 py-3">{coupon.discountValue}</td>
                    <td className="px-6 py-3">
                      {coupon.usageCount}/{coupon.usageLimit || "unlimited"}
                    </td>
                    <td className="px-6 py-3 text-sm">
                      {new Date(coupon.expiryDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3">
                      {coupon.isActive ? (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                          Active
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3 space-x-2">
                      <Link
                        href={`/admin/coupons/${coupon._id}/edit`}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(coupon._id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No coupons yet</p>
            <Link
              href="/admin/coupons/new"
              className="bg-purple-700 text-white px-6 py-2 rounded hover:bg-purple-800"
            >
              Create First Coupon
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
