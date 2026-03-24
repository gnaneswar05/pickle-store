"use client";

import { useAuth } from "@/app/store/useStore";
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

export default function OrdersPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("kanvi-token")}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setOrders(data.data.orders || []);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, router]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-100 text-amber-900";
      case "CONFIRMED":
        return "bg-sky-100 text-sky-900";
      case "PREPARING":
        return "bg-orange-100 text-orange-900";
      case "DELIVERED":
        return "bg-emerald-100 text-emerald-900";
      default:
        return "bg-stone-100 text-stone-800";
    }
  };

  const getOrderTotal = (order: Order) =>
    order.totalAmount ??
    order.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

  return (
    <div className="space-y-8">
      <section className="rounded-[34px] border border-[var(--line)] bg-white/80 p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--brand)]">
          Order Tracker
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-[var(--brand-deep)]">
          Your Orders
        </h1>
        <p className="mt-2 text-sm leading-6 text-stone-600">
          Open any order to view items, payment type, address, and the latest
          preparation status.
        </p>
      </section>

      {loading ? (
        <div className="py-16 text-center text-stone-600">Loading orders...</div>
      ) : orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="rounded-[28px] border border-[var(--line)] bg-white p-5 shadow-[0_14px_40px_rgba(92,60,37,0.07)]"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
                    Order ID
                  </p>
                  <p className="mt-1 font-mono text-sm text-[var(--brand-deep)]">
                    {order._id}
                  </p>
                  <p className="mt-3 text-sm text-stone-600">
                    {new Date(order.createdAt).toLocaleDateString()} •{" "}
                    {order.items.length} item{order.items.length > 1 ? "s" : ""} •{" "}
                    {order.paymentType}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(order.status)}`}
                  >
                    {order.status}
                  </span>
                  <Link
                    href={`/orders/${order._id}`}
                    className="rounded-full bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white"
                  >
                    View Details
                  </Link>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3 text-sm text-stone-600">
                {order.items.slice(0, 3).map((item) => (
                  <span
                    key={`${order._id}-${item.name}`}
                    className="rounded-full bg-[var(--surface)] px-3 py-1"
                  >
                    {item.name} x {item.quantity}
                  </span>
                ))}
              </div>

              <div className="mt-5 text-right text-lg font-semibold text-[var(--brand-deep)]">
                Total: Rs. {getOrderTotal(order)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-[28px] border border-dashed border-[var(--line)] bg-white/60 py-16 text-center text-stone-600">
          No orders yet.
        </div>
      )}
    </div>
  );
}
