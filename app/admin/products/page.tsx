"use client";

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
              className="text-purple-700 font-bold hover:text-purple-900"
            >
              Products
            </Link>
            <Link
              href="/admin/banners"
              className="text-gray-600 hover:text-purple-700"
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
          <h2 className="text-3xl font-bold text-gray-900">Products</h2>
          <Link
            href="/admin/products/new"
            className="bg-purple-700 text-white px-6 py-2 rounded hover:bg-purple-800"
          >
            Add Product
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left font-bold">Name</th>
                  <th className="px-6 py-3 text-left font-bold">Price</th>
                  <th className="px-6 py-3 text-left font-bold">Trending</th>
                  <th className="px-6 py-3 text-left font-bold">Seasonal</th>
                  <th className="px-6 py-3 text-left font-bold">Active</th>
                  <th className="px-6 py-3 text-left font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-b hover:bg-gray-50">
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
              className="bg-purple-700 text-white px-6 py-2 rounded hover:bg-purple-800"
            >
              Create First Product
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
