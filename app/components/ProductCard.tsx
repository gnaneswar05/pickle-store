"use client";

import FallbackImage from "@/app/components/FallbackImage";
import { useCart, useToast } from "@/app/store/useStore";
import { useState } from "react";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
}

export default function ProductCard({
  id,
  name,
  price,
  image,
  description,
}: ProductCardProps) {
  const { addItem } = useCart();
  const { pushToast } = useToast();
  const [showPulse, setShowPulse] = useState(false);

  const handleAddToCart = () => {
    addItem({
      productId: id,
      name,
      price,
      quantity: 1,
      image,
    });

    setShowPulse(true);
    window.setTimeout(() => setShowPulse(false), 650);

    pushToast({
      title: `${name} added to cart`,
      message: "You can review quantities from the cart any time.",
      tone: "success",
    });
  };

  return (
    <div className="group overflow-hidden rounded-[28px] border border-[var(--line)] bg-[var(--surface-strong)] shadow-[0_18px_48px_rgba(92,60,37,0.08)] transition hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(92,60,37,0.16)]">
      <div className="relative h-64 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(45,27,18,0.25)] via-transparent to-transparent z-10" />
        <FallbackImage
          src={image}
          alt={name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-4 top-4 z-20 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--olive)]">
          Small Batch
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-[var(--brand-deep)]">
              {name}
            </h3>
            {description ? (
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-stone-600">
                {description}
              </p>
            ) : null}
          </div>
          <div className="rounded-full bg-[rgba(215,163,71,0.22)] px-3 py-1 text-sm font-semibold text-[var(--brand-deep)]">
            Rs. {price}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <p className="max-w-[11rem] text-xs uppercase tracking-[0.24em] text-stone-500">
            Tangy. Spicy. Meal-ready.
          </p>
          <div className="relative">
            {showPulse ? (
              <span className="pointer-events-none absolute -top-7 right-4 text-sm font-bold text-[var(--brand)] animate-[pulse-pop_.65s_ease-out]">
                +1
              </span>
            ) : null}
            <button
              onClick={handleAddToCart}
              className="rounded-full bg-[var(--brand)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:-translate-y-0.5 hover:bg-[var(--brand-deep)]"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
