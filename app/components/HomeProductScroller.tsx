"use client";

import ProductCard from "@/app/components/ProductCard";
import { useEffect, useRef, useState } from "react";

interface ProductItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
}

interface HomeProductScrollerProps {
  products: ProductItem[];
}

export default function HomeProductScroller({
  products,
}: HomeProductScrollerProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(products.length > 1);

  const updateScrollState = () => {
    const track = trackRef.current;
    if (!track) {
      return;
    }

    setCanScrollLeft(track.scrollLeft > 8);
    setCanScrollRight(
      track.scrollLeft + track.clientWidth < track.scrollWidth - 8,
    );
  };

  useEffect(() => {
    updateScrollState();
    const track = trackRef.current;
    if (!track) {
      return;
    }

    track.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      track.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [products.length]);

  const scrollByAmount = (direction: "left" | "right") => {
    const track = trackRef.current;
    if (!track) {
      return;
    }

    const amount = Math.max(track.clientWidth * 0.82, 280);
    track.scrollBy({
      left: direction === "right" ? amount : -amount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-16 bg-gradient-to-r from-[rgba(247,239,228,0.96)] to-transparent lg:block" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-16 bg-gradient-to-l from-[rgba(247,239,228,0.96)] to-transparent lg:block" />

      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scrollByAmount("left")}
            disabled={!canScrollLeft}
            className="rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm font-semibold text-[var(--brand-deep)] shadow-sm disabled:cursor-not-allowed disabled:opacity-45"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={() => scrollByAmount("right")}
            disabled={!canScrollRight}
            className="rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm font-semibold text-[var(--brand-deep)] shadow-sm disabled:cursor-not-allowed disabled:opacity-45"
          >
            Next
          </button>
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-stone-500">
          Swipe or scroll
        </p>
      </div>

      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((product, index) => (
          <div
            key={product._id}
            className={`shrink-0 w-[84%] max-w-[320px] min-w-[280px] snap-start transition duration-300 md:w-[46%] xl:w-[30%] ${
              index % 2 === 0 ? "md:translate-y-0" : "md:translate-y-4"
            }`}
          >
            <div className="rounded-[32px] bg-[linear-gradient(180deg,rgba(255,255,255,0.85),rgba(255,248,240,0.35))] p-1 shadow-[0_16px_40px_rgba(92,60,37,0.08)]">
              <ProductCard
                id={product._id}
                name={product.name}
                price={product.price}
                image={product.image}
                description={product.description}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
