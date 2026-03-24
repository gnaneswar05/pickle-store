"use client";

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
  const [siteSettings, setSiteSettings] = useState<Record<string, string> | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  const getOrderTotal = (value: OrderDetail) =>
    value.totalAmount ??
    value.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

  useEffect(() => {
    const token = localStorage.getItem("admin-token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    const fetchOrder = async () => {
      try {
        const [orderRes, settingsRes] = await Promise.all([
          fetch(`/api/orders/${params.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch("/api/site-settings", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);
        const orderData = await orderRes.json();
        const settingsData = await settingsRes.json();

        if (!orderRes.ok) {
          throw new Error(orderData.error || "Failed to fetch order");
        }

        setOrder(orderData.data.order);
        if (settingsRes.ok) {
          setSiteSettings(settingsData.data.settings || settingsData.data);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchOrder();
    }
  }, [params.id, router]);

  if (loading) {
    return <div className="py-16 text-center text-gray-600">Loading order...</div>;
  }

  if (!order) {
    return (
      <div className="py-16 text-center">
        <p className="text-gray-600">Order not found.</p>
        <Link href="/admin/orders" className="mt-4 inline-block text-blue-700">
          Back to orders
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-purple-700 text-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Kanvi Admin</h1>
          <div className="flex items-center gap-3">
            <Link href="/admin/settings" className="rounded bg-white/15 px-4 py-2 text-sm font-semibold">
              Settings
            </Link>
            <Link href="/admin/taxes" className="rounded bg-white/15 px-4 py-2 text-sm font-semibold">
              Taxes
            </Link>
            <Link href="/admin/orders" className="rounded bg-white/15 px-4 py-2 text-sm font-semibold">
              Back
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-3xl font-bold text-gray-900">Order #{order._id}</h2>
          <p className="mt-2 text-sm text-gray-600">
            {new Date(order.createdAt).toLocaleString()} • {order.paymentType} •{" "}
            {order.status}
          </p>
        </div>

        <InvoiceCard
          order={{ ...order, totalAmount: getOrderTotal(order) }}
          siteSettings={siteSettings ?? undefined}
          onPrint={() => window.print()}
        />
      </div>
    </div>
  );
}
