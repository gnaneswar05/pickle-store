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
    if (!confirm("Are you sure?")) return;

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
      title="Banners"
      subtitle="Update homepage campaigns and hero visuals."
      actions={
        <Link
          href="/admin/banners/new"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Add Banner
        </Link>
      }
    >
        {loading ? (
          <div className="rounded-xl border border-gray-200/50 bg-white p-10 text-center text-gray-600 shadow-sm">
            Loading banners...
          </div>
        ) : banners.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {banners.map((banner) => (
              <div
                key={banner._id}
                className="overflow-hidden rounded-xl border border-gray-200/50 bg-white shadow-sm"
              >
                <div className="h-40 bg-gray-100 relative w-full">
                  <FallbackImage
                    src={banner.image}
                    alt={banner.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{banner.title}</h3>
                  <div className="flex justify-between items-center">
                    <span
                      className={
                        banner.isActive ? "text-green-600" : "text-gray-500"
                      }
                    >
                      {banner.isActive ? "✅ Active" : "❌ Inactive"}
                    </span>
                    <div className="space-x-2">
                      <Link
                        href={`/admin/banners/${banner._id}/edit`}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(banner._id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No banners yet</p>
            <Link
              href="/admin/banners/new"
              className="rounded-lg bg-slate-900 px-6 py-2 text-white hover:bg-slate-800"
            >
              Create First Banner
            </Link>
          </div>
        )}
    </AdminShell>
  );
}
