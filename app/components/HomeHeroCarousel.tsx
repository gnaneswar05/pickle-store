"use client";

import FallbackImage from "@/app/components/FallbackImage";
import Link from "next/link";
import { useEffect, useState } from "react";

interface BannerItem {
  _id: string;
  image: string;
  title: string;
}

interface HomeHeroCarouselProps {
  banners: BannerItem[];
}

const heroLines = [
  "Stone-ground masala, bright oil, and a slow-building kick.",
  "Built for curd rice, hot dal, paratha mornings, and late-night plates.",
  "Small-batch jars that feel festive even on an ordinary lunch.",
];

const heroNotes = [
  "Freshly packed this week",
  "Travel-safe jars",
  "Family-style spice balance",
];

export default function HomeHeroCarousel({
  banners,
}: HomeHeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const slides =
    banners.length > 0
      ? banners
      : [{ _id: "fallback", image: "/logo.jpeg", title: "Homemade pickle collection" }];

  useEffect(() => {
    if (slides.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [slides.length]);

  const activeSlide = slides[activeIndex];

  return (
    <section className="relative overflow-hidden rounded-[38px] border border-[var(--line)] bg-[linear-gradient(135deg,#5b1f12_0%,#8c341f_38%,#d7a347_100%)] shadow-[0_28px_90px_rgba(92,60,37,0.22)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,243,221,0.25),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(101,112,79,0.28),transparent_28%)]" />
      <div className="absolute inset-0 opacity-90">
        {slides.map((slide, index) => (
          <div
            key={slide._id}
            className={`absolute inset-0 transition-all duration-700 ${
              index === activeIndex
                ? "scale-100 opacity-100"
                : "scale-[1.04] opacity-0"
            }`}
          >
            <FallbackImage
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              fallbackSrc="/logo.jpeg"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(45,27,18,0.85)_0%,rgba(45,27,18,0.58)_42%,rgba(45,27,18,0.16)_100%)]" />
          </div>
        ))}
      </div>

      <div className="relative grid min-h-[420px] gap-6 px-5 py-6 md:min-h-[460px] md:px-7 md:py-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-9 lg:py-9">
        <div className="flex flex-col justify-between">
          <div>
            <div className="inline-flex rounded-full border border-white/25 bg-white/12 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-amber-50 backdrop-blur-md">
              Signature Pantry Drops
            </div>
            <h1 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight text-white md:text-4xl lg:text-5xl">
              Homemade jars with a bold, festive personality.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-stone-100/92 md:text-base">
              {heroLines[activeIndex % heroLines.length]}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[var(--brand-deep)] shadow-sm hover:-translate-y-0.5"
              >
                Shop the collection
              </Link>
              <Link
                href="/orders"
                className="rounded-full border border-white/35 bg-white/8 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/14"
              >
                Track your order
              </Link>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {heroNotes.map((note, index) => (
              <div
                key={note}
                className="rounded-[22px] border border-white/16 bg-white/10 p-3 text-white/92 backdrop-blur-md"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-100/80">
                  0{index + 1}
                </p>
                <p className="mt-1.5 text-xs leading-5 md:text-sm">{note}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-between gap-4">
          <div className="ml-auto w-full max-w-sm rounded-[28px] border border-white/14 bg-[rgba(255,248,240,0.12)] p-4 text-white shadow-[0_20px_60px_rgba(20,12,8,0.18)] backdrop-blur-md animate-[hero-float_6s_ease-in-out_infinite]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-100/80">
                  Active Banner
                </p>
                <h2 className="mt-2 text-xl font-semibold md:text-2xl">
                  {activeSlide.title}
                </h2>
              </div>
              <div className="rounded-full bg-white/12 px-3 py-1 text-xs font-semibold">
                {String(activeIndex + 1).padStart(2, "0")}/{String(
                  slides.length,
                ).padStart(2, "0")}
              </div>
            </div>
            <div className="mt-4 rounded-[22px] border border-white/10 bg-[rgba(45,27,18,0.22)] p-3">
              <p className="text-sm leading-5 text-stone-100/88">
                Rich oils, sharp tang, and the kind of spice that keeps building
                with every bite.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            <div className="rounded-[24px] border border-white/15 bg-white/10 p-4 text-white backdrop-blur-md">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-100/75">
                Pairing
              </p>
              <p className="mt-2 text-base font-semibold">Curd rice and paratha</p>
            </div>
            <div className="rounded-[24px] border border-white/15 bg-white/10 p-4 text-white backdrop-blur-md">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-100/75">
                Texture
              </p>
              <p className="mt-2 text-base font-semibold">Chunky cuts and glossy masala</p>
            </div>
            <div className="rounded-[24px] border border-white/15 bg-white/10 p-4 text-white backdrop-blur-md">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-100/75">
                Mood
              </p>
              <p className="mt-2 text-base font-semibold">Everyday meal, festival energy</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="flex gap-2">
              {slides.map((slide, index) => (
                <button
                  key={slide._id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Go to banner ${index + 1}`}
                  className={`h-2.5 rounded-full transition-all ${
                    index === activeIndex
                      ? "w-12 bg-white"
                      : "w-6 bg-white/35 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  setActiveIndex(
                    (current) => (current - 1 + slides.length) % slides.length,
                  )
                }
                className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/16"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() =>
                  setActiveIndex((current) => (current + 1) % slides.length)
                }
                className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/16"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
