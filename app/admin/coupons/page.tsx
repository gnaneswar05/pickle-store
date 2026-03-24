"use client";

import AdminShell from "@/app/components/AdminShell";
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

  return (
    <AdminShell
      activeHref="/admin/coupons"
      title="Coupons"
      subtitle="Create and manage discounts for checkout."
      actions={
        <Link
          href="/admin/coupons/new"
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
        >
          Create Coupon
        </Link>
      }
    >
        {loading ? (
          <div className="rounded-xl border border-gray-200/50 bg-white p-10 text-center text-gray-600 shadow-sm">
            Loading coupons...
          </div>
        ) : coupons.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border border-gray-200/50 bg-white shadow-sm">
            <table className="w-full">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Code</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Value</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Usage</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Expiry</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr key={coupon._id} className="border-b last:border-b-0 hover:bg-gray-50">
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
              className="rounded-lg bg-green-600 px-6 py-2 text-white hover:bg-green-700"
            >
              Create First Coupon
            </Link>
          </div>
        )}
    </AdminShell>
  );
}
