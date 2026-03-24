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
      subtitle="Manage product availability, categories, and merchandising flags."
      actions={
        <Link
          href="/admin/products/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Add Product
        </Link>
      }
    >
        {loading ? (
          <div className="rounded-xl border border-gray-200/50 bg-white p-10 text-center text-gray-600 shadow-sm">
            Loading products...
          </div>
        ) : products.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border border-gray-200/50 bg-white shadow-sm">
            <table className="w-full">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Trending</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Seasonal</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Active</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-b last:border-b-0 hover:bg-gray-50">
                    <td className="px-6 py-3">{product.name}</td>
                    <td className="px-6 py-3">₹{product.price}</td>
                    <td className="px-6 py-3">
                      {product.isTrending ? "✅" : "❌"}
                    </td>
                    <td className="px-6 py-3">
                      {product.isSeasonal ? "✅" : "❌"}
                    </td>
                    <td className="px-6 py-3">
                      {product.isActive ? "✅" : "❌"}
                    </td>
                    <td className="px-6 py-3 space-x-2">
                      <Link
                        href={`/admin/products/${product._id}/edit`}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id)}
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
            <p className="text-gray-600 mb-4">No products yet</p>
            <Link
              href="/admin/products/new"
              className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
            >
              Create First Product
            </Link>
          </div>
        )}
    </AdminShell>
  );
}
