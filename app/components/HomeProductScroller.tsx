"use client";

import ProductCard from "@/app/components/ProductCard";
import { useEffect, useRef, useState } from "react";

interface ProductItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  isTrending?: boolean;
}

interface HomeProductScrollerProps {
  products: ProductItem[];
  accent?: "warm" | "olive";
}

export default function HomeProductScroller({
  products,
  accent = "warm",
}: HomeProductScrollerProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(products.length > 1);

  const frameTone =
    accent === "olive"
      ? "from-[rgba(101,112,79,0.12)] via-white to-[rgba(255,255,255,0.9)]"
      : "from-[rgba(215,163,71,0.16)] via-white to-[rgba(255,248,240,0.92)]";

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

    const amount = Math.max(track.clientWidth * 0.72, 260);
    track.scrollBy({
      left: direction === "right" ? amount : -amount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">
          Curated shelf
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            onClick={() => scrollByAmount("left")}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
            className="rounded-full border border-[var(--line)] bg-white/88 px-4 py-2 text-sm font-semibold text-[var(--brand-deep)] shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={() => scrollByAmount("right")}
            disabled={!canScrollRight}
            aria-label="Scroll right"
            className="rounded-full border border-[var(--line)] bg-white/88 px-4 py-2 text-sm font-semibold text-[var(--brand-deep)] shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[34px] border border-[var(--line)] bg-[rgba(255,255,255,0.5)] p-3 md:p-4">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-20 bg-gradient-to-r from-[rgba(255,248,242,0.98)] to-transparent lg:block" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-20 bg-gradient-to-l from-[rgba(255,248,242,0.98)] to-transparent lg:block" />

        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto px-1 pb-3 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-5"
        >
          {products.map((product) => (
            <div
              key={product._id}
              className="shrink-0 w-[85%] min-w-[274px] max-w-[290px] snap-start md:w-[43%] md:min-w-[300px] md:max-w-[340px] xl:w-[31%] xl:min-w-[320px]"
            >
              <div
                className={`h-full rounded-[30px] bg-gradient-to-b ${frameTone} p-1 shadow-[0_18px_48px_rgba(92,60,37,0.1)]`}
              >
                <ProductCard
                  id={product._id}
                  name={product.name}
                  price={product.price}
                  image={product.image}
                  description={product.description}
                  isTrending={product.isTrending}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-2 flex items-center justify-between md:hidden">
          <div className="text-[11px] font-semibold uppercase tracking-[0.26em] text-stone-500">
            Swipe to browse
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => scrollByAmount("left")}
              disabled={!canScrollLeft}
              className="rounded-full border border-[var(--line)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--brand-deep)] disabled:opacity-40"
            >
              Prev
            </button>
            <button
              type="button"
              onClick={() => scrollByAmount("right")}
              disabled={!canScrollRight}
              className="rounded-full border border-[var(--line)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--brand-deep)] disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
