"use client";

import { useMemo, useState } from "react";
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

/* ================= TYPES ================= */

type Variant = { title: string };
type ProductItem = {
  name: string;
  image?: string;
  variants?: Variant[];
};

type BrandGroup = { brand: string; products: ProductItem[] };

const ALL_BRAND_KEY = "__ALL__";

/* ================= PAGE ================= */

export default function ProductsPage() {
  const items = toArray<ProductItem>((data as any)?.productsSection?.items);

  const [query, setQuery] = useState("");

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

      if (!map.has(brand)) {
        map.set(brand, { brand, products: [] });
      }
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

  const [activeBrand, setActiveBrand] = useState<string>(() => ALL_BRAND_KEY);

  /* ===== FILTER (SEARCH) ===== */
  const filteredGroup = useMemo<BrandGroup | null>(() => {
    const group = groupsWithAll.find((g) => g.brand === activeBrand);
    if (!group) return null;

    const q = normalize(query);
    if (!q) return group;

    // 1) prefix match (AL... kimi başlayanlar əvvəl)
    const prefix = group.products.filter((p) => {
      if (startsWithQuery(p.name, q)) return true;
      return p.variants?.some((v) => startsWithQuery(v.title, q));
    });

    // 2) contains match (içində olanlar), prefix-ləri təkrarlamasın
    const contains = group.products.filter((p) => {
      const hit =
        includesQuery(p.name, q) ||
        p.variants?.some((v) => includesQuery(v.title, q));
      if (!hit) return false;
      return !prefix.includes(p);
    });

    return {
      ...group,
      products: [...prefix, ...contains],
    };
  }, [groupsWithAll, activeBrand, query]);

  if (!groupsWithAll.length) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-16 text-black">
        <h1 className="text-3xl font-extrabold text-black">Məhsullar</h1>
        <p className="mt-3 text-black">productsSection.items tapılmadı</p>
      </main>
    );
  }

  const activeTitle =
    activeBrand === ALL_BRAND_KEY ? "Bütün məhsullar" : filteredGroup?.brand;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 text-black">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-extrabold text-black">Məhsullar</h1>
        <div className="mt-3 h-1 w-14 bg-[#F2A900]" />
      </div>

      {/* SEARCH */}
      <div className="mt-6 max-w-md">
        <input
          type="text"
          placeholder="Məhsul və ya variant axtar..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-black outline-none transition focus:border-[#F2A900]/60 focus:ring-4 focus:ring-[#F2A900]/15"
        />
       
      </div>

      <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* LEFT: BRAND LIST */}
        <aside className="lg:col-span-4">
          <div className="rounded-3xl border border-black/10 bg-white p-4">
            <div className="text-sm font-extrabold text-black">Firmalar</div>

            <div className="mt-4 max-h-[520px] space-y-2 overflow-auto">
              {groupsWithAll.map((g) => {
                const active = g.brand === activeBrand;
                const label = g.brand === ALL_BRAND_KEY ? "BÜTÜN MƏHSULLAR" : g.brand;

                return (
                  <button
                    key={g.brand}
                    onClick={() => {
                      setActiveBrand(g.brand);
                      // query qalır (çünki sən dedin axtarış üçün hamısında işləsin)
                      // istəsən burda setQuery("") edə bilərik
                    }}
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

        {/* RIGHT: PRODUCTS */}
        <div className="lg:col-span-8">
          <div className="rounded-3xl border border-black/10 bg-white p-6 max-h-[520px] overflow-auto">
            <h2 className="text-2xl font-extrabold text-black">{activeTitle}</h2>

            <div className="mt-6 space-y-5">
              {filteredGroup?.products.length ? (
                filteredGroup.products.map((p) => (
                  <div key={p.name} className="rounded-2xl border border-black/10 p-5">
                    <div className="text-lg font-extrabold text-black">{p.name}</div>

                    <ul className="mt-3 space-y-2">
                      {p.variants?.map((v, i) => (
                        <li key={v.title + i} className="flex gap-3 text-sm font-semibold text-black">
                          <span className="mt-2 h-2 w-2 rounded-full bg-[#F2A900]" />
                          {v.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              ) : (
                <div className="text-sm text-black">Axtarışa uyğun nəticə tapılmadı.</div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
