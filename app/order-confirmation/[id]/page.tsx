"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function OrderConfirmationPage() {
  const params = useParams<{ id: string }>();

  return (
    <div className="flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-2xl rounded-[34px] border border-[var(--line)] bg-white p-8 text-center shadow-[0_22px_60px_rgba(92,60,37,0.1)]">
        <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-full bg-emerald-100 text-3xl">
          OK
        </div>
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--olive)]">
          Order Confirmed
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-[var(--brand-deep)]">
          Your jar order is in.
        </h1>
        <p className="mt-4 text-sm leading-6 text-stone-600">
          We saved your order successfully. You can track updates, status, and
          delivery details from the order detail page.
        </p>
        <div className="mt-6 rounded-2xl bg-[var(--surface)] px-4 py-4 text-sm text-stone-700">
          <span className="font-semibold text-[var(--brand-deep)]">Order ID:</span>{" "}
          <span className="font-mono">{params.id}</span>
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href={`/orders/${params.id}`}
            className="rounded-full bg-[var(--brand)] px-6 py-3 text-sm font-semibold text-white"
          >
            View Order
          </Link>
          <Link
            href="/products"
            className="rounded-full border border-[var(--line)] bg-white px-6 py-3 text-sm font-semibold text-[var(--brand-deep)]"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
