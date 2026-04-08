"use client";

import AdminImageField from "@/app/components/AdminImageField";
import AdminShell from "@/app/components/AdminShell";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminEditBannerPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("admin-token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    const fetchBanners = async () => {
      try {
        const res = await fetch("/api/banners", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        const banner = (data.data.banners || []).find(
          (item: { _id: string }) => item._id === id,
        );

        if (!banner) {
          throw new Error("Banner not found");
        }

        setTitle(banner.title || "");
        setImage(banner.image || "");
        setIsActive(Boolean(banner.isActive));
      } catch (fetchError) {
        console.error(fetchError);
        setError("Failed to load banner details.");
      } finally {
        setPageLoading(false);
      }
    };

    if (id) {
      fetchBanners();
    }
  }, [id, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !image.trim()) {
      setError("Please fill all fields.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/banners/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          image: image.trim(),
          isActive,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to update banner.");
        return;
      }

      router.push("/admin/banners");
    } catch (saveError) {
      console.error(saveError);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminShell
      activeHref="/admin/banners"
      title="Edit Banner"
      subtitle="Tighten the homepage carousel with cleaner, image-first banner updates."
      actions={
        <Link
          href="/admin/banners"
          className="rounded-full border border-[#dccab3] bg-white px-5 py-2.5 text-sm font-semibold text-slate-700"
        >
          Back to Banners
        </Link>
      }
    >
      {pageLoading ? (
        <div className="rounded-[28px] border border-[#eadfce] bg-white p-10 text-center text-slate-600 shadow-[0_16px_45px_rgba(79,55,32,0.08)]">
          Loading banner...
        </div>
      ) : (
        <form
          onSubmit={handleSave}
          className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]"
        >
          <div className="space-y-6 rounded-[28px] border border-[#eadfce] bg-[linear-gradient(180deg,#fffdf9_0%,#fff7ef_100%)] p-6 shadow-[0_16px_45px_rgba(79,55,32,0.08)]">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#9b6b3f]">
                Banner Details
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-[#2f1b12]">
                Update campaign visual
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
                Keep this banner active on the homepage
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
              {loading ? "Saving..." : "Save Banner"}
            </button>
          </div>

          <div className="rounded-[28px] border border-[#eadfce] bg-white p-6 shadow-[0_16px_45px_rgba(79,55,32,0.08)]">
            <AdminImageField
              label="Banner Image"
              value={image}
              onChange={setImage}
              helperText="Upload a strong horizontal image. This carousel now works best with clean, wide visuals."
            />
          </div>
        </form>
      )}
    </AdminShell>
  );
}
