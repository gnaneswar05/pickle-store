"use client";

import FallbackImage from "@/app/components/FallbackImage";
import { useCart, useToast } from "@/app/store/useStore";
import Link from "next/link";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCart();
  const { pushToast } = useToast();
  const total = getTotal();

  if (items.length === 0) {
    return (
      <div className="rounded-[34px] border border-dashed border-[var(--line)] bg-white/60 px-6 py-18 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--olive)]">
          Cart Empty
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-[var(--brand-deep)]">
          Your spice shelf is waiting.
        </h1>
        <p className="mt-3 text-stone-600">
          Add a few jars and we will keep the checkout flow smooth.
        </p>
        <Link
          href="/products"
          className="mt-7 inline-flex rounded-full bg-[var(--brand)] px-6 py-3 text-sm font-semibold text-white"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[34px] border border-[var(--line)] bg-white/80 p-6 md:p-8">
        <h1 className="text-4xl font-semibold text-[var(--brand-deep)]">
          Shopping Cart
        </h1>
        <p className="mt-2 text-sm leading-6 text-stone-600">
          Review quantities, tune your basket, and move to checkout when ready.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="grid gap-4 rounded-[28px] border border-[var(--line)] bg-white p-4 shadow-[0_16px_44px_rgba(92,60,37,0.07)] md:grid-cols-[120px_1fr_auto]"
            >
              <div className="relative h-28 overflow-hidden rounded-2xl">
                <FallbackImage
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-[var(--brand-deep)]">
                  {item.name}
                </h2>
                <p className="mt-1 text-sm text-stone-500">
                  Rs. {item.price} per jar
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <div className="inline-flex items-center rounded-full border border-[var(--line)] bg-[var(--surface)] p-1">
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity - 1)
                      }
                      className="h-8 w-8 rounded-full text-sm font-semibold text-stone-700 hover:bg-white"
                    >
                      -
                    </button>
                    <span className="min-w-10 text-center text-sm font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                      className="h-8 w-8 rounded-full text-sm font-semibold text-stone-700 hover:bg-white"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      removeItem(item.productId);
                      pushToast({
                        title: `${item.name} removed`,
                        tone: "info",
                      });
                    }}
                    className="text-sm font-semibold text-rose-700"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="text-right text-lg font-semibold text-[var(--brand-deep)]">
                Rs. {item.price * item.quantity}
              </div>
            </div>
          ))}
        </div>

        <aside className="h-fit rounded-[30px] border border-[var(--line)] bg-[linear-gradient(180deg,#fffaf3,#fff)] p-6 shadow-[0_18px_56px_rgba(92,60,37,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--brand)]">
            Order Summary
          </p>
          <div className="mt-5 space-y-3 text-sm text-stone-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>Rs. {total}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Free</span>
            </div>
          </div>

          <div className="mt-5 border-t border-[var(--line)] pt-5">
            <div className="flex justify-between text-lg font-semibold text-[var(--brand-deep)]">
              <span>Total</span>
              <span>Rs. {total}</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="mt-6 block rounded-full bg-[var(--brand)] px-6 py-3 text-center text-sm font-semibold text-white"
          >
            Proceed to Checkout
          </Link>

          <button
            onClick={() => {
              clearCart();
              pushToast({
                title: "Cart cleared",
                message: "You can start fresh whenever you want.",
                tone: "info",
              });
            }}
            className="mt-3 w-full rounded-full border border-[var(--line)] bg-white px-6 py-3 text-sm font-semibold text-stone-700"
          >
            Clear Cart
          </button>
        </aside>
      </div>
    </div>
  );
}
