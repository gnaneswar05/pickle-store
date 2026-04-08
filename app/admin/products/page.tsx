"use client";

import AdminShell from "@/app/components/AdminShell";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Product {
  _id: string;
  name: string;
  price: number;
  isTrending: boolean;
  isSeasonal: boolean;
  isActive: boolean;
}

function ProductBadge({
  label,
  active,
  activeClassName,
}: {
  label: string;
  active: boolean;
  activeClassName: string;
}) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        active ? activeClassName : "bg-slate-100 text-slate-500"
      }`}
    >
      {label}
    </span>
  );
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("admin-token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setProducts(data.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [router]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
        },
      });

      if (res.ok) {
        setProducts(products.filter((p) => p._id !== id));
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <AdminShell
      activeHref="/admin/products"
      title="Products"
      subtitle="Manage pricing, merchandising flags, and live visibility with a cleaner product control view."
      actions={
        <Link
          href="/admin/products/new"
          className="rounded-full bg-[#3b2317] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:-translate-y-0.5"
        >
          Add Product
        </Link>
      }
    >
      {loading ? (
        <div className="rounded-[28px] border border-[#eadfce] bg-white p-10 text-center text-slate-600 shadow-[0_16px_45px_rgba(79,55,32,0.08)]">
          Loading products...
        </div>
      ) : products.length > 0 ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {products.map((product) => (
            <div
              key={product._id}
              className="rounded-[28px] border border-[#eadfce] bg-[linear-gradient(180deg,#fffdf9_0%,#fff7ef_100%)] p-5 shadow-[0_16px_45px_rgba(79,55,32,0.08)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#9b6b3f]">
                    Product
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-[#2f1b12]">
                    {product.name}
                  </h3>
                  <p className="mt-3 text-lg font-semibold text-[#8e4c25]">
                    Rs. {product.price}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    product.isActive
                      ? "bg-[#e5f3e4] text-[#2f6b2d]"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {product.isActive ? "Live" : "Hidden"}
                </span>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <ProductBadge
                  label="Trending"
                  active={product.isTrending}
                  activeClassName="bg-[#fde7cd] text-[#9a661d]"
                />
                <ProductBadge
                  label="Seasonal"
                  active={product.isSeasonal}
                  activeClassName="bg-[#e7f1e3] text-[#426035]"
                />
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/admin/products/${product._id}/edit`}
                  className="rounded-full bg-[#3b2317] px-4 py-2 text-sm font-semibold text-white"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(product._id)}
                  className="rounded-full border border-[#e6b6ac] bg-[#fff4f1] px-4 py-2 text-sm font-semibold text-[#b2412d]"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-[28px] border border-[#eadfce] bg-white p-10 text-center shadow-[0_16px_45px_rgba(79,55,32,0.08)]">
          <p className="text-slate-600">No products yet</p>
          <Link
            href="/admin/products/new"
            className="mt-4 inline-flex rounded-full bg-[#3b2317] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Create First Product
          </Link>
        </div>
      )}
    </AdminShell>
  );
}
