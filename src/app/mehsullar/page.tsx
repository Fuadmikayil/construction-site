"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import data from "../../data/products.generated.json";

/* ================= HELPERS ================= */

function cleanText(input: unknown) {
  if (input === null || input === undefined) return "";
  return String(input)
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function toArray<T = any>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

function normalize(s: string) {
  return cleanText(s).toLowerCase();
}

function startsWithQuery(text: string, q: string) {
  return normalize(text).startsWith(q);
}

function includesQuery(text: string, q: string) {
  return normalize(text).includes(q);
}

function getBrand(name: string) {
  const n = cleanText(name);
  if (!n) return "Digər";
  const beforeSlash = n.split("/")[0]?.trim() || n;
  return beforeSlash.split(" ")[0].toUpperCase();
}

/** səhifəni ref-ə scroll edərkən bir az “aşağı” offset verək */
function scrollToRefWithOffset(
  ref: React.RefObject<HTMLElement>,
  offset = -400
) {
  const el = ref.current;
  if (!el) return;

  const y = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
}

/* ================= TYPES ================= */

type Variant = { title: string };
type ProductItem = {
  name: string;
  image?: string;
  variants?: Variant[];
};

type BrandGroup = { brand: string; products: ProductItem[] };

type SearchHit = {
  brand: string;
  productName: string;
  variantTitle?: string;
  score: number;
};

const ALL_BRAND_KEY = "__ALL__";

/* ================= PAGE ================= */

export default function ProductsPage() {
  const items = toArray<ProductItem>((data as any)?.productsSection?.items);

  const [query, setQuery] = useState("");
  const [activeBrand, setActiveBrand] = useState<string>(ALL_BRAND_KEY);

  const [openSuggest, setOpenSuggest] = useState(false);

  const productRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const resultsSectionRef = useRef<HTMLDivElement | null>(null);
  const rightListRef = useRef<HTMLDivElement | null>(null);

  const [pendingScroll, setPendingScroll] = useState<string | null>(null);

  /* ===== NORMALIZE ITEMS ===== */
  const normalizedItems = useMemo<ProductItem[]>(() => {
    return items
      .map((p) => {
        const name = cleanText(p?.name);
        if (!name) return null;

        const variants = toArray(p?.variants)
          .map((v: any) => ({ title: cleanText(v?.title) }))
          .filter((v) => v.title);

        return { ...p, name, variants };
      })
      .filter(Boolean) as ProductItem[];
  }, [items]);

  /* ===== GROUP BY BRAND ===== */
  const grouped = useMemo<BrandGroup[]>(() => {
    const map = new Map<string, BrandGroup>();

    for (const p of normalizedItems) {
      const brand = getBrand(p.name);
      if (!map.has(brand)) map.set(brand, { brand, products: [] });
      map.get(brand)!.products.push(p);
    }

    const arr = Array.from(map.values()).sort((a, b) =>
      a.brand.localeCompare(b.brand, "tr")
    );

    for (const g of arr) {
      g.products.sort((a, b) => a.name.localeCompare(b.name, "tr"));
    }

    return arr;
  }, [normalizedItems]);

  /* ===== ALL GROUP (TOP) ===== */
  const allGroup = useMemo<BrandGroup>(() => {
    const products = [...normalizedItems].sort((a, b) =>
      a.name.localeCompare(b.name, "tr")
    );
    return { brand: ALL_BRAND_KEY, products };
  }, [normalizedItems]);

  const groupsWithAll = useMemo<BrandGroup[]>(() => {
    return [allGroup, ...grouped];
  }, [allGroup, grouped]);

  /* ===== ACTIVE GROUP ===== */
  const activeGroup = useMemo<BrandGroup | null>(() => {
    return groupsWithAll.find((g) => g.brand === activeBrand) ?? null;
  }, [groupsWithAll, activeBrand]);

  /* ===== FILTER (RIGHT LIST) ===== */
  const filteredGroup = useMemo<BrandGroup | null>(() => {
    if (!activeGroup) return null;

    const q = normalize(query);
    if (!q) return activeGroup;

    const prefix = activeGroup.products.filter((p) => {
      if (startsWithQuery(p.name, q)) return true;
      return p.variants?.some((v) => startsWithQuery(v.title, q));
    });

    const contains = activeGroup.products.filter((p) => {
      const hit =
        includesQuery(p.name, q) ||
        p.variants?.some((v) => includesQuery(v.title, q));
      if (!hit) return false;
      return !prefix.includes(p);
    });

    return { ...activeGroup, products: [...prefix, ...contains] };
  }, [activeGroup, query]);

  /* ===== SEARCH SUGGESTIONS (INPUT ALTINDA) ===== */
  const suggestions = useMemo<SearchHit[]>(() => {
    const q = normalize(query);
    if (!q) return [];

    const hits: SearchHit[] = [];

    for (const p of normalizedItems) {
      const brand = getBrand(p.name);

      if (startsWithQuery(p.name, q)) {
        hits.push({ brand, productName: p.name, score: 1 });
      } else if (includesQuery(p.name, q)) {
        hits.push({ brand, productName: p.name, score: 3 });
      }

      for (const v of p.variants ?? []) {
        if (startsWithQuery(v.title, q)) {
          hits.push({
            brand,
            productName: p.name,
            variantTitle: v.title,
            score: 2,
          });
        } else if (includesQuery(v.title, q)) {
          hits.push({
            brand,
            productName: p.name,
            variantTitle: v.title,
            score: 4,
          });
        }
      }
    }

    hits.sort((a, b) => {
      if (a.score !== b.score) return a.score - b.score;
      return a.productName.localeCompare(b.productName, "tr");
    });

    return hits.slice(0, 20);
  }, [query, normalizedItems]);

  const activeTitle =
    activeBrand === ALL_BRAND_KEY ? "Bütün məhsullar" : filteredGroup?.brand;

  /* ===== CLICK SUGGESTION: BRAND SET + SCROLL PRODUCT ===== */
  const onPickSuggestion = (hit: SearchHit) => {
    setActiveBrand(hit.brand);
    setPendingScroll(hit.productName);
    setOpenSuggest(false);
  };

  /* ✅ Suggestion clickdən sonra səhifə + sağ panel scroll */
  useEffect(() => {
    if (!pendingScroll) return;

    scrollToRefWithOffset(resultsSectionRef as any, -400);

    const t = window.setTimeout(() => {
      const container = rightListRef.current;
      const target = productRefs.current[pendingScroll];

      if (container && target) {
        const top = target.offsetTop - container.offsetTop;
        container.scrollTo({ top: Math.max(0, top - 12), behavior: "smooth" });
      } else if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      setPendingScroll(null);
    }, 140);

    return () => window.clearTimeout(t);
  }, [pendingScroll]);

  /* ===== OPEN/CLOSE SUGGEST PANEL ===== */
  useEffect(() => {
    if (!query.trim()) {
      setOpenSuggest(false);
      return;
    }
    setOpenSuggest(true);
  }, [query]);

  useEffect(() => {
    const onDoc = () => setOpenSuggest(false);
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  /* ✅ AXTAR BUTTON: basanda nəticələrə scroll */
  const onSearch = () => {
    setOpenSuggest(false);

    rightListRef.current?.scrollTo({ top: 0, behavior: "smooth" });

    scrollToRefWithOffset(resultsSectionRef as any, -400);
  };

  if (!groupsWithAll.length) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-16">
        <h1 className="text-3xl font-extrabold text-black">Məhsullar</h1>
        <p className="mt-3 text-black">productsSection.items tapılmadı</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 text-black">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-extrabold text-black">Məhsullar</h1>
        <div className="mt-3 h-1 w-14 bg-[#F2A900]" />
      </div>

      {/* SEARCH + BUTTON + SUGGEST */}
      <div
        className="relative mt-6 max-w-xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Məhsul və ya variant axtar..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSearch();
            }}
            onFocus={() => query.trim() && setOpenSuggest(true)}
            className="h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-black outline-none transition focus:border-[#F2A900]/60 focus:ring-4 focus:ring-[#F2A900]/15"
          />

          {/* ✅ LG+ (notebook) ekranlarda gizlət */}
          <button
            type="button"
            onClick={onSearch}
            className="lg:hidden h-12 shrink-0 rounded-xl bg-[#F2A900] px-5 text-sm font-extrabold text-black transition hover:brightness-95"
          >
            AXTAR
          </button>
        </div>

        {/* Suggest panel */}
        {openSuggest && suggestions.length > 0 && (
          <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-50 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-xl">
            <div className="max-h-[360px] overflow-auto p-2">
              {suggestions.map((hit, idx) => (
                <button
                  key={`${hit.brand}-${hit.productName}-${hit.variantTitle ?? ""}-${idx}`}
                  type="button"
                  onClick={() => onPickSuggestion(hit)}
                  className="w-full rounded-xl px-3 py-2 text-left transition hover:bg-black/[0.03]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-extrabold text-black">
                        {hit.productName}
                      </div>
                      {hit.variantTitle ? (
                        <div className="truncate text-xs font-semibold text-black">
                          {hit.variantTitle}
                        </div>
                      ) : (
                        <div className="truncate text-xs font-semibold text-black/70">
                          Məhsul adı
                        </div>
                      )}
                    </div>

                    <div className="shrink-0 rounded-full border border-black/10 px-2 py-1 text-[11px] font-extrabold text-black">
                      {hit.brand}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {openSuggest && query.trim() && suggestions.length === 0 && (
          <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-50 rounded-2xl border border-black/10 bg-white p-3 text-sm font-semibold text-black shadow-xl">
            Nəticə tapılmadı.
          </div>
        )}
      </div>

      {/* ✅ scroll buraya gələcək (offset ilə) */}
      <div ref={resultsSectionRef} />

      <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* LEFT: BRAND LIST */}
        <aside className="lg:col-span-4">
          <div className="rounded-3xl border border-black/10 bg-white p-4">
            <div className="text-sm font-extrabold text-black">Firmalar</div>

            <div className="mt-4 max-h-[520px] space-y-2 overflow-auto">
              {groupsWithAll.map((g) => {
                const active = g.brand === activeBrand;
                const label =
                  g.brand === ALL_BRAND_KEY ? "BÜTÜN MƏHSULLAR" : g.brand;

                return (
                  <button
                    key={g.brand}
                    onClick={() => setActiveBrand(g.brand)}
                    className={`w-full rounded-2xl border px-4 py-3 text-left text-sm font-extrabold text-black transition ${
                      active
                        ? "border-[#F2A900]/50 bg-[#F2A900]/10"
                        : "border-black/10 hover:bg-black/[0.03]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-black">{label}</span>
                      <span className="rounded-full border border-black/10 px-2 py-0.5 text-xs text-black">
                        {g.products.length}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* RIGHT: PRODUCTS (SCROLL) */}
        <div className="lg:col-span-8">
          <div
            ref={rightListRef}
            className="max-h-[520px] overflow-auto rounded-3xl border border-black/10 bg-white p-6"
          >
            <h2 className="text-2xl font-extrabold text-black">{activeTitle}</h2>

            <div className="mt-6 space-y-5">
              {filteredGroup?.products.length ? (
                filteredGroup.products.map((p) => (
                  <div
                    key={p.name}
                    ref={(el) => {
                      productRefs.current[p.name] = el;
                    }}
                    className="rounded-2xl border border-black/10 p-5"
                  >
                    <div className="text-lg font-extrabold text-black">{p.name}</div>

                    {!!p.variants?.length && (
                      <ul className="mt-3 space-y-2">
                        {p.variants.map((v, i) => (
                          <li
                            key={v.title + i}
                            className="flex gap-3 text-sm font-semibold text-black"
                          >
                            <span className="mt-2 h-2 w-2 rounded-full bg-[#F2A900]" />
                            {v.title}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-sm font-semibold text-black">
                  Axtarışa uyğun nəticə tapılmadı.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
