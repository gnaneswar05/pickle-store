"use client";

import AdminImageField from "@/app/components/AdminImageField";
import AdminShell from "@/app/components/AdminShell";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminCreateProductPage() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [isTrending, setIsTrending] = useState(false);
  const [isSeasonal, setIsSeasonal] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !price || !image || !description) {
      setError("Please fill all fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
        },
        body: JSON.stringify({
          name,
          price,
          image,
          description,
          isTrending,
          isSeasonal,
          isActive,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create product.");
        return;
      }

      router.push("/admin/products");
    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminShell
      activeHref="/admin/products"
      title="Add Product"
      subtitle="Create a cleaner product entry with stronger hierarchy for price, imagery, and merchandising."
      actions={
        <Link
          href="/admin/products"
          className="rounded-full border border-[#dccab3] bg-white px-5 py-2.5 text-sm font-semibold text-slate-700"
        >
          Back to Products
        </Link>
      }
    >
      <form
        onSubmit={handleCreate}
        className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]"
      >
        <div className="space-y-6 rounded-[28px] border border-[#eadfce] bg-[linear-gradient(180deg,#fffdf9_0%,#fff7ef_100%)] p-6 shadow-[0_16px_45px_rgba(79,55,32,0.08)]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#9b6b3f]">
              Product Details
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-[#2f1b12]">
              Build a strong shelf card
            </h3>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Product Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-2xl border border-[#dccab3] bg-white px-4 py-3 text-sm text-slate-700 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Price
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              min={1}
              required
              className="w-full rounded-2xl border border-[#dccab3] bg-white px-4 py-3 text-sm text-slate-700 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              required
              className="w-full rounded-2xl border border-[#dccab3] bg-white px-4 py-3 text-sm text-slate-700 outline-none"
            />
          </div>

          <div className="grid gap-3">
            <label className="flex items-center gap-3 rounded-2xl border border-[#eadfce] bg-white px-4 py-4">
              <input
                type="checkbox"
                checked={isTrending}
                onChange={(e) => setIsTrending(e.target.checked)}
              />
              <span className="text-sm font-medium text-slate-700">
                Mark as trending
              </span>
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-[#eadfce] bg-white px-4 py-4">
              <input
                type="checkbox"
                checked={isSeasonal}
                onChange={(e) => setIsSeasonal(e.target.checked)}
              />
              <span className="text-sm font-medium text-slate-700">
                Mark as seasonal
              </span>
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-[#eadfce] bg-white px-4 py-4">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
              <span className="text-sm font-medium text-slate-700">
                Keep product visible on storefront
              </span>
            </label>
          </div>

          {error ? (
            <div className="rounded-2xl border border-[#f0c8bf] bg-[#fff4f1] px-4 py-3 text-sm text-[#b2412d]">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-[#3b2317] px-5 py-3 text-sm font-semibold text-white shadow-sm disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Product"}
          </button>
        </div>

        <div className="rounded-[28px] border border-[#eadfce] bg-white p-6 shadow-[0_16px_45px_rgba(79,55,32,0.08)]">
          <AdminImageField
            label="Product Image"
            value={image}
            onChange={setImage}
            helperText="Choose a clear product image. This will be used on cards, shelves, and detail views."
          />
        </div>
      </form>
    </AdminShell>
  );
}
