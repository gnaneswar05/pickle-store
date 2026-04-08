"use client";

import AdminShell from "@/app/components/AdminShell";
import InvoiceCard from "@/app/components/InvoiceCard";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface OrderDetail {
  _id: string;
  invoiceNumber?: string;
  items: Array<{ productId: string; name: string; quantity: number; price: number }>;
  subtotalAmount?: number;
  taxableAmount?: number;
  totalTaxAmount?: number;
  taxes?: Array<{ name: string; rate: number; amount: number }>;
  deliveryCharge?: number;
  totalAmount: number;
  discountAmount: number;
  paymentType: "COD" | "ONLINE";
  status: string;
  shipperName?: string | null;
  createdAt: string;
  address: {
    name: string;
    phone: string;
    address: string;
    pincode: string;
  };
}

export default function AdminOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [siteSettings, setSiteSettings] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [shipperName, setShipperName] = useState("");

  const getOrderTotal = (value: OrderDetail) =>
    value.totalAmount ??
    value.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    const token = localStorage.getItem("admin-token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    const fetchOrder = async () => {
      try {
        const [orderRes, settingsRes] = await Promise.all([
          fetch(`/api/orders/${params.id}`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch("/api/site-settings", { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const orderData = await orderRes.json();
        const settingsData = await settingsRes.json();

        if (!orderRes.ok) throw new Error(orderData.error);
        
        setOrder(orderData.data.order);
        setShipperName(orderData.data.order.shipperName || "");
        if (settingsRes.ok) setSiteSettings(settingsData.data.settings || settingsData.data);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchOrder();
  }, [params.id, router]);

  const handleUpdateStatus = async (newStatus: string) => {
    if (!order) return;
    
    if (newStatus === "SHIPPED" && !shipperName.trim()) {
      alert("Please enter a Shipper Name before marking as SHIPPED.");
      return;
    }

    setUpdating(true);
    try {
      const res = await fetch(`/api/orders/${order._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
        },
        body: JSON.stringify({ status: newStatus, shipperName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setOrder(data.data.order);
      alert("Order status updated successfully!");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to update order");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <AdminShell activeHref="/admin/orders" title="Order Details" subtitle="Loading invoice data...">
        <div className="py-16 text-center text-gray-500">Loading order...</div>
      </AdminShell>
    );
  }

  if (!order) {
    return (
      <AdminShell activeHref="/admin/orders" title="Order Not Found" subtitle="Could not locate this order.">
        <div className="py-16 text-center">
          <Link href="/admin/orders" className="text-gray-900 underline">Back to orders</Link>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell activeHref="/admin/orders" title={`Order #${order.invoiceNumber || order._id.slice(-8).toUpperCase()}`} subtitle={`${new Date(order.createdAt).toLocaleString()} • ${order.paymentType} • ${order.status}`}>
      
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm print:hidden">
        <h3 className="mb-4 font-bold text-gray-900">Manage Order Fulfillment</h3>
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="mb-2 block text-sm font-semibold text-gray-600">Update Status</label>
            <select
              value={order.status}
              disabled={updating}
              onChange={(e) => handleUpdateStatus(e.target.value)}
              className="w-full rounded border border-gray-300 bg-white px-4 py-2 font-medium text-gray-900"
            >
              <option value="PENDING">PENDING</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="PREPARING">PREPARING</option>
              <option value="SHIPPED">SHIPPED</option>
              <option value="DELIVERED">DELIVERED</option>
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="mb-2 block text-sm font-semibold text-gray-600">Shipper / Tracking Name</label>
            <input
              type="text"
              value={shipperName}
              onChange={(e) => setShipperName(e.target.value)}
              placeholder="e.g. BlueDart / Kanvi Direct"
              disabled={updating}
              className="w-full rounded border border-gray-300 bg-white px-4 py-2 text-gray-900"
            />
          </div>
          <button
            onClick={() => handleUpdateStatus(order.status)}
            disabled={updating}
            className="rounded bg-gray-900 px-6 py-2 font-bold text-white transition hover:bg-gray-800 disabled:opacity-50"
          >
            {updating ? "Saving..." : "Save Shipper"}
          </button>
        </div>
      </div>

      <InvoiceCard
        order={{ ...order, totalAmount: getOrderTotal(order) }}
        siteSettings={siteSettings ?? undefined}
        onPrint={() => window.print()}
      />
    </AdminShell>
  );
}
