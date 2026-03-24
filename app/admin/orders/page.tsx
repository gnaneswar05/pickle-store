"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Order {
  _id: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  totalAmount: number;
  paymentType: "COD" | "ONLINE";
  status: string;
  createdAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("admin-token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch orders");
        }

        setOrders(data.data.orders || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  const statusOptions = ["PENDING", "CONFIRMED", "PREPARING", "DELIVERED"];

  const getOrderTotal = (order: Order) =>
    order.totalAmount ??
    order.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setOrders((currentOrders) =>
          currentOrders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order,
          ),
        );
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin-token");
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
              className="text-gray-600 hover:text-purple-700"
            >
              Banners
            </Link>
            <Link
              href="/admin/orders"
              className="text-purple-700 font-bold hover:text-purple-900"
            >
              Orders
            </Link>
            <Link
              href="/admin/coupons"
              className="text-gray-600 hover:text-purple-700"
            >
              Coupons
            </Link>
            <Link
              href="/admin/taxes"
              className="text-gray-600 hover:text-purple-700"
            >
              Taxes
            </Link>
          </div>
        </nav>

        <h2 className="text-3xl font-bold text-gray-900 mb-6">Orders</h2>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : orders.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left font-bold">Order ID</th>
                  <th className="px-6 py-3 text-left font-bold">Items</th>
                  <th className="px-6 py-3 text-left font-bold">Total</th>
                  <th className="px-6 py-3 text-left font-bold">Payment</th>
                  <th className="px-6 py-3 text-left font-bold">Status</th>
                  <th className="px-6 py-3 text-left font-bold">Date</th>
                  <th className="px-6 py-3 text-left font-bold">View</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm">{order._id}</td>
                    <td className="px-6 py-3 text-sm">
                      {order.items.length} items
                    </td>
                    <td className="px-6 py-3 font-bold">Rs. {getOrderTotal(order)}</td>
                    <td className="px-6 py-3 text-sm">{order.paymentType}</td>
                    <td className="px-6 py-3">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        className="border rounded px-2 py-1"
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-3 text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3 text-sm">
                      <Link
                        href={`/admin/orders/${order._id}`}
                        className="font-semibold text-blue-700 hover:underline"
                      >
                        Open
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No orders yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
