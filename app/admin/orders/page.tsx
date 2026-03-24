"use client";

import AdminShell from "@/app/components/AdminShell";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Order {
  _id: string;
  invoiceNumber?: string;
  shipperName?: string | null;
  address?: {
    name?: string;
    phone?: string;
  };
  items: Array<{ name: string; quantity: number; price: number }>;
  totalAmount: number;
  paymentType: "COD" | "ONLINE";
  status: string;
  createdAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("admin-token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: "10",
        });
        if (statusFilter !== "ALL") {
          params.set("status", statusFilter);
        }
        if (search.trim()) {
          params.set("search", search.trim());
        }

        const res = await fetch(`/api/orders?${params.toString()}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch orders");
        }

        setOrders(data.data.orders || []);
        setPage(data.data.page || 1);
        setTotalPages(data.data.totalPages || 1);
        setTotalOrders(data.data.total || 0);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [page, router, search, statusFilter]);

  const statusOptions = [
    "PENDING",
    "CONFIRMED",
    "PREPARING",
    "SHIPPED",
    "DELIVERED",
  ];

  const getOrderTotal = (order: Order) =>
    order.totalAmount ??
    order.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      let shipperName = "";
      if (newStatus === "SHIPPED") {
        shipperName =
          window.prompt("Enter shipper name for this order:", "")?.trim() || "";

        if (!shipperName) {
          return;
        }
      }

      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
        },
        body: JSON.stringify({ status: newStatus, shipperName }),
      });

      if (res.ok) {
        setOrders((currentOrders) =>
          currentOrders.map((order) =>
            order._id === orderId
              ? {
                  ...order,
                  status: newStatus,
                  shipperName:
                    newStatus === "SHIPPED" ? shipperName : order.shipperName,
                }
              : order,
          ),
        );
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const handleExport = async () => {
    try {
      const res = await fetch("/api/orders/export", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to export orders");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "orders-export.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting orders:", error);
    }
  };

  return (
    <AdminShell
      activeHref="/admin/orders"
      title="Orders"
      subtitle={`Total orders: ${totalOrders}`}
      actions={
        <>
          <input
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            placeholder="Search customer, phone, invoice, shipper..."
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 outline-none"
          />
          <select
            value={statusFilter}
            onChange={(e) => {
              setPage(1);
              setStatusFilter(e.target.value);
            }}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700"
          >
            <option value="ALL">All Statuses</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <Link
            href="/admin/settings"
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Site Settings
          </Link>
          <button
            type="button"
            onClick={handleExport}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Export CSV
          </button>
        </>
      }
    >
        {loading ? (
          <div className="rounded-xl border border-gray-200/50 bg-white p-10 text-center text-gray-600 shadow-sm">
            Loading orders...
          </div>
        ) : orders.length > 0 ? (
          <>
            <div className="overflow-x-auto rounded-xl border border-gray-200/50 bg-white shadow-sm">
              <table className="w-full">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Order ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Invoice</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Items</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Total</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Payment</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Shipped By</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">View</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b last:border-b-0 hover:bg-gray-50">
                      <td className="px-6 py-3 text-sm">{order._id}</td>
                      <td className="px-6 py-3 text-sm">
                        {order.invoiceNumber || "-"}
                      </td>
                      <td className="px-6 py-3 text-sm">
                        <div>{order.address?.name || "-"}</div>
                        <div className="text-gray-500">
                          {order.address?.phone || ""}
                        </div>
                      </td>
                      <td className="px-6 py-3 text-sm">
                        {order.items.length} items
                      </td>
                      <td className="px-6 py-3 font-bold">
                        Rs. {getOrderTotal(order)}
                      </td>
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
                        {order.shipperName || "-"}
                      </td>
                      <td className="px-6 py-3 text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-3 text-sm">
                        <Link
                          href={`/admin/orders/${order._id}`}
                          className="font-medium text-blue-600 hover:underline"
                        >
                          Open
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex items-center justify-between rounded-xl border border-gray-200/50 bg-white px-6 py-4 shadow-sm">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(current - 1, 1))}
                disabled={page <= 1}
                className="rounded border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 disabled:opacity-50"
              >
                Previous
              </button>
              <p className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </p>
              <button
                type="button"
                onClick={() =>
                  setPage((current) => Math.min(current + 1, totalPages))
                }
                disabled={page >= totalPages}
                className="rounded border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <div className="rounded-xl border border-gray-200/50 bg-white p-10 text-center text-gray-600 shadow-sm">
            No orders yet.
          </div>
        )}
    </AdminShell>
  );
}
