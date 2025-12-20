"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import data from "../data/baza.json";

type HeroSlide = {
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
  image: string;
};

function ArrowLeft(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
    </svg>
  );
}
function ArrowRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
    </svg>
  );
}

export default function Hero() {
  const slides = useMemo(() => {
    return (data as unknown as { hero: { slides: HeroSlide[] } }).hero.slides ?? [];
  }, []);

  const total = slides.length;
  const [index, setIndex] = useState(0);

  const goPrev = () => setIndex((i) => (i - 1 + total) % total);
  const goNext = () => setIndex((i) => (i + 1) % total);

  // autoplay
  useEffect(() => {
    if (total <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % total), 6000);
    return () => clearInterval(t);
  }, [total]);

  // swipe (touch)
  const startX = useRef<number | null>(null);
  const deltaX = useRef<number>(0);

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    deltaX.current = 0;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (startX.current === null) return;
    deltaX.current = e.touches[0].clientX - startX.current;
  };

  const onTouchEnd = () => {
    const threshold = 50; // nə qədər sürüşdürsə keçsin
    if (deltaX.current > threshold) goPrev();
    else if (deltaX.current < -threshold) goNext();

    startX.current = null;
    deltaX.current = 0;
  };

  if (!total) return null;

  const slide = slides[index];

  return (
    <section
      className="relative h-[520px] w-full md:h-[640px] select-none"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <Image src={slide.image} alt={slide.title} fill priority className="object-cover" />

      <div className="absolute inset-0 bg-black/35" />

      {/* Content */}
        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-4 lg:px-18">

        <div className="max-w-2xl text-white">
          <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
            {slide.title}
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/90 md:text-lg">
            {slide.description}
          </p>

          <div className="mt-8">
            <Link
              href={slide.buttonHref}
              className="inline-flex items-center justify-center rounded-none bg-[#F2A900] px-8 py-4 text-sm font-semibold text-black transition hover:brightness-95"
            >
              {slide.buttonText}
            </Link>
          </div>
        </div>
      </div>

      {/* Arrows – yalnız desktop (lg) */}
      {total > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={goPrev}
            className="absolute left-3 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-none bg-black/45 p-3 text-white transition hover:bg-black/60 lg:flex"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>

          <button
            type="button"
            aria-label="Next slide"
            onClick={goNext}
            className="absolute right-3 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-none bg-black/45 p-3 text-white transition hover:bg-black/60 lg:flex"
          >
            <ArrowRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Dots */}
      {total > 1 && (
        <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3">
          {slides.map((_, i) => {
            const active = i === index;
            return (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-3 w-3 rounded-full border border-white/70 transition ${
                  active ? "bg-white" : "bg-white/20 hover:bg-white/40"
                }`}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
