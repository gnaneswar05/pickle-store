"use client";

import AdminImageField from "@/app/components/AdminImageField";
import AdminShell from "@/app/components/AdminShell";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminCreateBannerPage() {
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("admin-token");
    if (!token) {
      router.push("/admin/login");
    }
  }, [router]);

  const handleCreateBanner = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image.trim() || !title.trim()) {
      setError("Please fill all fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/banners", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
        },
        body: JSON.stringify({
          image: image.trim(),
          title: title.trim(),
          isActive,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create banner.");
        return;
      }

      router.push("/admin/banners");
    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminShell
      activeHref="/admin/banners"
      title="Add Banner"
      subtitle="Create a tighter, more image-led homepage slide instead of a large content-heavy hero."
      actions={
        <Link
          href="/admin/banners"
          className="rounded-full border border-[#dccab3] bg-white px-5 py-2.5 text-sm font-semibold text-slate-700"
        >
          Back to Banners
        </Link>
      }
    >
      <form
        onSubmit={handleCreateBanner}
        className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]"
      >
        <div className="space-y-6 rounded-[28px] border border-[#eadfce] bg-[linear-gradient(180deg,#fffdf9_0%,#fff7ef_100%)] p-6 shadow-[0_16px_45px_rgba(79,55,32,0.08)]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#9b6b3f]">
              Banner Details
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-[#2f1b12]">
              Add a homepage campaign slide
            </h3>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Banner Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full rounded-2xl border border-[#dccab3] bg-white px-4 py-3 text-sm text-slate-700 outline-none"
            />
          </div>

          <label className="flex items-center gap-3 rounded-2xl border border-[#eadfce] bg-white px-4 py-4">
            <input
              id="isActive"
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 rounded border-[#cbb39a]"
            />
            <span className="text-sm font-medium text-slate-700">
              Show this banner in the homepage carousel
            </span>
          </label>

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
            {loading ? "Creating..." : "Create Banner"}
          </button>
        </div>

        <div className="rounded-[28px] border border-[#eadfce] bg-white p-6 shadow-[0_16px_45px_rgba(79,55,32,0.08)]">
          <AdminImageField
            label="Banner Image"
            value={image}
            onChange={setImage}
            helperText="Use a clean, wide banner image. The homepage slider is now compact and image-first."
          />
        </div>
      </form>
    </AdminShell>
  );
}
