"use client";

import InvoiceCard from "@/app/components/InvoiceCard";
import { useAuth } from "@/app/store/useStore";
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
  createdAt: string;
  address: {
    name: string;
    phone: string;
    address: string;
    pincode: string;
  };
}

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const getOrderTotal = (value: OrderDetail) =>
    value.totalAmount ??
    value.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${params.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("kanvi-token")}`,
          },
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch order");
        }

        setOrder(data.data.order);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchOrder();
    }
  }, [isAuthenticated, params.id, router]);

  if (loading) {
    return <div className="py-16 text-center text-stone-600">Loading order...</div>;
  }

  if (!order) {
    return (
      <div className="rounded-[28px] border border-dashed border-[var(--line)] bg-white/60 py-16 text-center">
        <p className="text-stone-600">Order not found.</p>
        <Link href="/orders" className="mt-4 inline-flex text-sm font-semibold text-[var(--brand)]">
          Back to orders
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[34px] border border-[var(--line)] bg-white/80 p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--brand)]">
              Order Details
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-[var(--brand-deep)]">
              Order #{order._id}
            </h1>
            <p className="mt-2 text-sm text-stone-600">
              {new Date(order.createdAt).toLocaleString()} • {order.paymentType}
            </p>
          </div>
          <Link
            href="/orders"
            className="rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm font-semibold text-[var(--brand-deep)]"
          >
            Back to orders
          </Link>
        </div>
      </section>

      <InvoiceCard
        order={{ ...order, totalAmount: getOrderTotal(order) }}
        onPrint={() => window.print()}
      />
    </div>
  );
}
