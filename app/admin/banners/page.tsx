"use client";

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
              className="text-purple-700 font-bold hover:text-purple-900"
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
              className="text-gray-600 hover:text-purple-700"
            >
              Coupons
            </Link>
          </div>
        </nav>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Banners</h2>
          <Link
            href="/admin/banners/new"
            className="bg-purple-700 text-white px-6 py-2 rounded hover:bg-purple-800"
          >
            Add Banner
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : banners.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {banners.map((banner) => (
              <div
                key={banner._id}
                className="bg-white rounded-lg shadow overflow-hidden"
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
              className="bg-purple-700 text-white px-6 py-2 rounded hover:bg-purple-800"
            >
              Create First Banner
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
