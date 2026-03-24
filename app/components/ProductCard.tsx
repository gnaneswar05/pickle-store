"use client";

import FallbackImage from "@/app/components/FallbackImage";
import { useAuth, useCart, useToast } from "@/app/store/useStore";
import { useRouter } from "next/navigation";
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
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const { pushToast } = useToast();
  const router = useRouter();
  const [showPulse, setShowPulse] = useState(false);

  const handleAddToCart = () => {
    if (!isAuthenticated()) {
      pushToast({
        title: "Login required",
        message: "Please sign in before adding items to your cart.",
        tone: "error",
      });
      router.push("/login");
      return;
    }

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
    <div className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-[rgba(84,53,33,0.08)] bg-[var(--surface-strong)] shadow-[0_18px_48px_rgba(92,60,37,0.07)] transition hover:-translate-y-1 hover:shadow-[0_26px_60px_rgba(92,60,37,0.14)]">
      <div className="relative h-60 overflow-hidden rounded-[24px]">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[rgba(45,27,18,0.16)] via-transparent to-transparent" />
        <FallbackImage
          src={image}
          alt={name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-4 top-4 z-20 rounded-full border border-white/70 bg-[rgba(255,255,255,0.92)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--olive)] shadow-sm">
          Most Loved
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-stone-500">
              Signature Jar
            </p>
            <h3 className="mt-2 line-clamp-2 text-xl font-semibold leading-8 text-[var(--brand-deep)]">
              {name}
            </h3>
            <p className="mt-2 min-h-12 line-clamp-2 text-sm leading-6 text-stone-600">
              {description || "Authentic homemade pickle with bold flavor and rich masala."}
            </p>
          </div>
          <div className="shrink-0 rounded-full bg-[rgba(215,163,71,0.18)] px-3 py-1.5 text-sm font-semibold text-[var(--brand-deep)]">
            Rs. {price}
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-[rgba(84,53,33,0.08)] pt-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-stone-500">
              Pantry Note
            </p>
            <p className="mt-1 text-sm text-stone-700">Tangy, spicy, meal-ready.</p>
          </div>
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
