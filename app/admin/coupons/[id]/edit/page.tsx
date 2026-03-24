"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Coupon {
  _id: string;
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  expiryDate: string;
  usageLimit: number;
  isActive: boolean;
}

export default function AdminEditCouponPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"PERCENTAGE" | "FIXED">(
    "PERCENTAGE",
  );
  const [discountValue, setDiscountValue] = useState(0);
  const [expiryDate, setExpiryDate] = useState("");
  const [usageLimit, setUsageLimit] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin-token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    const loadCoupon = async () => {
      try {
        const res = await fetch(`/api/coupons`);
        if (!res.ok) {
          throw new Error("Could not load coupon");
        }

        const data = await res.json();
        const coupon = data.data.coupons?.find((c: Coupon) => c._id === id);

        if (!coupon) {
          setError("Coupon not found");
          return;
        }

        setCode(coupon.code || "");
        setDiscountType(coupon.discountType || "PERCENTAGE");
        setDiscountValue(coupon.discountValue || 0);
        setExpiryDate(new Date(coupon.expiryDate).toISOString().split("T")[0]);
        setUsageLimit(coupon.usageLimit || 0);
        setIsActive(coupon.isActive);
      } catch (err) {
        console.error(err);
        setError("Failed to load coupon details.");
      }
    };

    if (id) {
      loadCoupon();
    }
  }, [id, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!code.trim() || !expiryDate.trim() || discountValue <= 0) {
      setError("Please fill all required fields correctly.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/coupons/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
        },
        body: JSON.stringify({
          code: code.trim(),
          discountType,
          discountValue,
          expiryDate,
          usageLimit,
          isActive,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to update coupon.");
        return;
      }

      router.push("/admin/coupons");
    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Edit Coupon</h1>
          <Link
            href="/admin/coupons"
            className="text-sm text-purple-700 hover:underline"
          >
            Back to coupons
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
            {error}
          </div>
        )}

        <form
          onSubmit={handleUpdate}
          className="space-y-5 bg-white p-6 rounded-lg shadow"
        >
          <div>
            <label className="block text-gray-700 mb-2">Coupon Code</label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Discount Type</label>
              <select
                value={discountType}
                onChange={(e) =>
                  setDiscountType(e.target.value as "PERCENTAGE" | "FIXED")
                }
                className="w-full px-3 py-2 border border-gray-300 rounded"
              >
                <option value="PERCENTAGE">Percentage</option>
                <option value="FIXED">Fixed</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Discount Value</label>
              <input
                type="number"
                value={discountValue}
                onChange={(e) => setDiscountValue(Number(e.target.value))}
                min={1}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Expiry Date</label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Usage Limit</label>
              <input
                type="number"
                value={usageLimit}
                onChange={(e) => setUsageLimit(Number(e.target.value))}
                min={0}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              id="isActive"
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            <label htmlFor="isActive" className="text-gray-700">
              Active
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-purple-700 text-white rounded hover:bg-purple-800 disabled:bg-gray-400"
          >
            {loading ? "Updating..." : "Update Coupon"}
          </button>
        </form>
      </div>
    </div>
  );
}
