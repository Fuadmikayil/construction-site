"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import productsData from "../data/products.generated.json";

/* ================= TYPES ================= */

type Variant = { title: string; price?: number };
type ProductItem = {
  name: string;
  image: string;
  variants: Variant[];
};

/* ================= ICONS ================= */

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
function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

/* ================= PAGE ================= */

export default function ProductsSlider() {
  const section = useMemo(() => {
    return productsData as unknown as {
      productsSection?: { title?: string; items?: ProductItem[] };
    };
  }, []);

  const title = section.productsSection?.title ?? "Məhsullar";
  const items = section.productsSection?.items ?? [];

  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const [active, setActive] = useState<ProductItem | null>(null);
  const [imgError, setImgError] = useState<Record<string, boolean>>({});

  const scrollByAmount = (dir: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;

    const amount = Math.round(el.clientWidth * 0.7);
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  if (!items.length) return null;

  return (
    <section className="w-full">
      <div className="mx-auto max-w-7xl px-4 py-14">
        {/* Header */}
        <div className="mb-10">
          <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            {title}
          </h2>
          <div className="mt-4 h-[4px] w-14 bg-[#F2A900]" />
        </div>

        <div className="relative">
          {/* Desktop arrows */}
          <button
            type="button"
            aria-label="Prev"
            onClick={() => scrollByAmount("left")}
            className="absolute left-0 top-1/2 z-20 hidden -translate-x-1/2 -translate-y-1/2
                       items-center justify-center bg-black/55 p-3 text-white
                       backdrop-blur-sm transition hover:bg-black/70 lg:flex"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>

          <button
            type="button"
            aria-label="Next"
            onClick={() => scrollByAmount("right")}
            className="absolute right-0 top-1/2 z-20 hidden translate-x-1/2 -translate-y-1/2
                       items-center justify-center bg-black/55 p-3 text-white
                       backdrop-blur-sm transition hover:bg-black/70 lg:flex"
          >
            <ArrowRight className="h-6 w-6" />
          </button>

          {/* Scroller */}
          <div
            ref={scrollerRef}
            className="flex snap-x snap-mandatory gap-8 overflow-x-auto pb-4
                       scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none]
                       [&::-webkit-scrollbar]:hidden"
          >
            {items.map((item) => {
              const broken = !!imgError[item.name];

              return (
                <article
                  key={item.name}
                  className="group relative w-[260px] shrink-0 snap-start bg-white/30 md:w-[320px]"
                >
                  <div className="relative overflow-hidden bg-black/5 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
                    {/* Image */}
                    <div className="relative h-[300px] md:h-[340px]">
                      {!broken ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                          onError={() => setImgError((s) => ({ ...s, [item.name]: true }))}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-black/10">
                          <span className="text-sm font-semibold text-black/60">şəkil yoxdur</span>
                        </div>
                      )}

                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    </div>

                    {/* Label */}
                    <div className="relative -mt-10 px-6 pb-6">
                      <div className="mx-auto w-[85%] bg-white px-6 py-5 text-center shadow-lg transition-transform duration-500 ease-out group-hover:-translate-y-1">
                        <h3 className="text-xl font-extrabold text-black">{item.name}</h3>
                      </div>

                      <div className="mt-8 text-center">
                        <button
                          type="button"
                          onClick={() => setActive(item)}
                          className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-black transition hover:opacity-70"
                        >
                          ƏTRAFLI <span aria-hidden="true">›</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Mobile hint */}
          <p className="mt-2 text-center text-xs text-black/60 lg:hidden">
            Sürüşdürərək bax (swipe)
          </p>
        </div>

        {/* ✅ ALL PRODUCTS BUTTON */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/mehsullar"
            className="inline-flex items-center justify-center gap-2
                       rounded-xl bg-[#F2A900] px-8 py-4
                       text-sm font-extrabold tracking-wide text-black
                       transition hover:brightness-95"
          >
            BÜTÜN MƏHSULLARA KEÇ <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      {/* Modal */}
      {active && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/55 p-4"
          onClick={() => setActive(null)}
        >
          <div
            className="flex w-full max-w-2xl flex-col bg-white text-black shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-black/10 p-6">
              <div>
                <h3 className="text-2xl font-extrabold text-black">{active.name}</h3>
                <p className="mt-1 text-sm text-black/60">Variantlar</p>
              </div>

              <button
                type="button"
                aria-label="Close"
                onClick={() => setActive(null)}
                className="rounded-md p-2 text-black/70 transition hover:bg-black/5"
              >
                <XIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Body (scroll) */}
            <div className="max-h-[70vh] overflow-y-auto p-6">
              <div className="overflow-hidden border border-black/10">
                <div className="grid grid-cols-1 divide-y divide-black/10">
                  {active.variants?.map((v, idx) => (
                    <div key={v.title + idx} className="flex items-center justify-between gap-4 px-4 py-3">
                      <span className="text-sm font-semibold text-black">{v.title}</span>
                      {typeof v.price === "number" && (
                        <span className="text-sm font-extrabold text-black">{v.price} ₼</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-black/10 p-6">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setActive(null)}
                  className="rounded-xl bg-[#F2A900] px-6 py-3 text-sm font-extrabold text-black transition hover:brightness-95"
                >
                  Bağla
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
