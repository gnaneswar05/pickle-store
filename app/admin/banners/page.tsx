"use client";

import AdminShell from "@/app/components/AdminShell";
import FallbackImage from "@/app/components/FallbackImage";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Banner {
  _id: string;
  image: string;
  title: string;
  isActive: boolean;
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
        setBanners(data.data.banners);
      } catch (error) {
        console.error("Error fetching banners:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, [router]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;

    try {
      const res = await fetch(`/api/banners/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
        },
      });

      if (res.ok) {
        setBanners(banners.filter((b) => b._id !== id));
      }
    } catch (error) {
      console.error("Error deleting banner:", error);
    }
  };

  return (
    <AdminShell
      activeHref="/admin/banners"
      title="Homepage Banners"
      subtitle="Keep the homepage carousel compact, image-led, and campaign-focused."
      actions={
        <Link
          href="/admin/banners/new"
          className="rounded-full bg-[#3b2317] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:-translate-y-0.5"
        >
          Add Banner
        </Link>
      }
    >
      {loading ? (
        <div className="rounded-[28px] border border-[#eadfce] bg-white p-10 text-center text-slate-600 shadow-[0_16px_45px_rgba(79,55,32,0.08)]">
          Loading banners...
        </div>
      ) : banners.length > 0 ? (
        <div className="grid gap-5 lg:grid-cols-2">
          {banners.map((banner, index) => (
            <div
              key={banner._id}
              className="overflow-hidden rounded-[28px] border border-[#eadfce] bg-white shadow-[0_16px_45px_rgba(79,55,32,0.08)]"
            >
              <div className="relative h-52 w-full bg-[#f5ede2]">
                <FallbackImage
                  src={banner.image}
                  alt={banner.title}
                  fill
                  className="object-cover"
                  fallbackSrc="/logo.jpeg"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_18%,rgba(27,14,8,0.68)_100%)]" />
                <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#3b2317]">
                  Slide {String(index + 1).padStart(2, "0")}
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-semibold text-white">{banner.title}</h3>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 p-5">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    banner.isActive
                      ? "bg-[#e5f3e4] text-[#2f6b2d]"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {banner.isActive ? "Active" : "Inactive"}
                </span>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/admin/banners/${banner._id}/edit`}
                    className="rounded-full bg-[#3b2317] px-4 py-2 text-sm font-semibold text-white"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(banner._id)}
                    className="rounded-full border border-[#e6b6ac] bg-[#fff4f1] px-4 py-2 text-sm font-semibold text-[#b2412d]"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-[28px] border border-[#eadfce] bg-white p-10 text-center shadow-[0_16px_45px_rgba(79,55,32,0.08)]">
          <p className="text-slate-600">No banners yet</p>
          <Link
            href="/admin/banners/new"
            className="mt-4 inline-flex rounded-full bg-[#3b2317] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Create First Banner
          </Link>
        </div>
      )}
    </AdminShell>
  );
}
