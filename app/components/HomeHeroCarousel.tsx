"use client";

import FallbackImage from "@/app/components/FallbackImage";
import { useEffect, useState } from "react";

interface BannerItem {
  _id: string;
  image: string;
  title: string;
}

interface HomeHeroCarouselProps {
  banners: BannerItem[];
}

export default function HomeHeroCarousel({
  banners,
}: HomeHeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const slides =
    banners.length > 0
      ? banners
      : [
          {
            _id: "fallback",
            image: "/logo.jpeg",
            title: "Homemade pickle collection",
          },
        ];

  useEffect(() => {
    if (slides.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 3600);

    return () => window.clearInterval(interval);
  }, [slides.length]);

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-[var(--line)] bg-[linear-gradient(180deg,#fff7ef_0%,#fffdf8_100%)] p-3 shadow-[0_24px_65px_rgba(79,55,32,0.12)] md:p-4">
      <div className="relative h-[190px] overflow-hidden rounded-[26px] sm:h-[230px] md:h-[260px] lg:h-[300px]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(215,163,71,0.18),transparent_26%),linear-gradient(135deg,rgba(59,35,23,0.10),rgba(59,35,23,0.02))]" />

        {slides.map((slide, index) => {
          const offset = (index - activeIndex + slides.length) % slides.length;
          const isActive = index === activeIndex;
          const isNext = offset === 1;
          const isPrev = offset === slides.length - 1;

          let placementClassName =
            "pointer-events-none translate-x-[72%] scale-[0.84] opacity-0";

          if (isActive) {
            placementClassName = "translate-x-0 scale-100 opacity-100 z-30";
          } else if (isNext) {
            placementClassName =
              "translate-x-[16%] scale-[0.9] opacity-55 z-20";
          } else if (isPrev) {
            placementClassName =
              "-translate-x-[16%] scale-[0.9] opacity-55 z-20";
          }

          return (
            <button
              key={slide._id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to banner ${index + 1}`}
              className={`absolute inset-y-0 left-0 right-0 m-auto h-full w-full overflow-hidden rounded-[26px] transition-all duration-700 ease-out ${placementClassName}`}
            >
              <FallbackImage
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                fallbackSrc="/logo.jpeg"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,9,5,0.14),rgba(18,9,5,0.04)_35%,rgba(18,9,5,0.18))]" />
            </button>
          );
        })}

        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-[linear-gradient(90deg,rgba(255,247,239,0.95),transparent)] sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-[linear-gradient(270deg,rgba(255,247,239,0.95),transparent)] sm:w-24" />

        {slides.length > 1 ? (
          <>
            <button
              type="button"
              onClick={() =>
                setActiveIndex(
                  (current) => (current - 1 + slides.length) % slides.length,
                )
              }
              className="absolute left-3 top-1/2 z-40 -translate-y-1/2 rounded-full border border-white/80 bg-white/90 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#3b2317] shadow-sm backdrop-blur-md"
            >
              Prev
            </button>
            <button
              type="button"
              onClick={() =>
                setActiveIndex((current) => (current + 1) % slides.length)
              }
              className="absolute right-3 top-1/2 z-40 -translate-y-1/2 rounded-full border border-white/80 bg-white/90 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#3b2317] shadow-sm backdrop-blur-md"
            >
              Next
            </button>
          </>
        ) : null}
      </div>

      {slides.length > 1 ? (
        <div className="mt-4 flex items-center justify-center gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide._id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to banner ${index + 1}`}
              className={`rounded-full transition-all ${
                index === activeIndex
                  ? "h-2.5 w-10 bg-[#3b2317]"
                  : "h-2.5 w-2.5 bg-[#d8c4aa]"
              }`}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
