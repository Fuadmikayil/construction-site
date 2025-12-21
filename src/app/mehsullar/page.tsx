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

/**
 * Brand/Firma çıxarma:
 * "STAR SUPER" -> "STAR"
 * "THİNNER / TİNNER 646" -> "THİNNER"
 * "CEKME" -> "CEKME"
 */
function getBrand(name: string) {
  const n = cleanText(name);
  if (!n) return "Digər";

  // əvvəl '/' varsa ondan əvvəli, sonra ilk söz
  const beforeSlash = n.split("/")[0]?.trim() || n;
  const firstWord = beforeSlash.split(" ")[0]?.trim() || n;

  return firstWord.toUpperCase();
}

/* ================= PAGE ================= */

type Variant = { title: string };
type ProductItem = { name: string; image?: string; variants?: Variant[] };

export default function ProductsPage() {
  const items = toArray<ProductItem>((data as any)?.productsSection?.items);

  const grouped = useMemo(() => {
    const map = new Map<string, { brand: string; products: ProductItem[] }>();

    for (const p of items) {
      const name = cleanText(p?.name);
      if (!name) continue;

      const brand = getBrand(name);

      if (!map.has(brand)) {
        map.set(brand, { brand, products: [] });
      }
      map.get(brand)!.products.push({
        ...p,
        name,
        variants: toArray(p?.variants)
          .map((v: any) => ({ title: cleanText(v?.title) }))
          .filter((x) => x.title),
      });
    }

    // brands sıralama + hər brand içində məhsul sıralama
    const arr = Array.from(map.values())
      .sort((a, b) => a.brand.localeCompare(b.brand, "tr"))
      .map((g) => ({
        ...g,
        products: g.products.sort((a, b) => a.name.localeCompare(b.name, "tr")),
      }));

    return arr;
  }, [items]);

  const [activeBrand, setActiveBrand] = useState<string>(() => grouped[0]?.brand ?? "");

  const activeGroup = grouped.find((g) => g.brand === activeBrand) ?? grouped[0];

  // grouped ilk dəfə boş gəlirsə fallback
  if (!grouped.length) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-16">
        <h1 className="text-3xl font-extrabold text-black">Məhsullar</h1>
        <p className="mt-3 text-black/60">
          Datanin içində <b>productsSection.items</b> tapılmadı.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:py-14">
      <div className="flex items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white md:text-4xl">Məhsullar</h1>
          <div className="mt-3 h-1 w-14 bg-[#F2A900]" />
        </div>
        <div className="text-sm text-black/50">{items.length} məhsul</div>
      </div>

      <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* LEFT: BRANDS TABLE */}
        <aside className="lg:col-span-4">
          <div className="rounded-3xl border border-black/10 bg-white p-4">
            <div className="text-sm font-extrabold text-black">Firmalar</div>

            <div className="mt-4 max-h-[520px] overflow-auto pr-1">
              <div className="grid gap-2">
                {grouped.map((g) => {
                  const isActive = g.brand === (activeGroup?.brand ?? activeBrand);
                  return (
                    <button
                      key={g.brand}
                      type="button"
                      onClick={() => setActiveBrand(g.brand)}
                      className={[
                        "w-full rounded-2xl border px-4 py-3 text-left text-sm font-extrabold transition",
                        isActive
                          ? "border-[#F2A900]/50 bg-[#F2A900]/10 text-black"
                          : "border-black/10 bg-white text-black/70 hover:bg-black/[0.03] hover:text-black",
                      ].join(" ")}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <span className="truncate">{g.brand}</span>
                        <span className="shrink-0 rounded-full border border-black/10 bg-white px-2 py-0.5 text-xs font-semibold text-black/60">
                          {g.products.length}
                        </span>
                      </div>
                      <div className="mt-1 text-xs font-medium text-black/45">
                        {g.products.length} məhsul
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* RIGHT: PRODUCTS OF BRAND */}
        <div className="lg:col-span-8">
          <div className="rounded-3xl border border-black/10 bg-white p-6 md:p-7">
            <div className="text-xs font-semibold text-black/50">Seçilmiş firma</div>
            <h2 className="mt-1 text-2xl font-extrabold text-black md:text-3xl">
              {activeGroup?.brand}
            </h2>
            <div className="mt-2 text-sm text-black/60">
              Məhsul sayı:{" "}
              <span className="font-semibold text-black/80">{activeGroup?.products.length ?? 0}</span>
            </div>

            <div className="mt-6 h-px bg-black/10" />

            <div className="mt-6 space-y-5">
              {activeGroup?.products.map((p) => (
                <div key={p.name} className="rounded-2xl border border-black/10 bg-white p-5">
                  <div className="text-lg font-extrabold text-black">{p.name}</div>

                  {p.variants?.length ? (
                    <ul className="mt-3 space-y-2">
                      {p.variants.map((v, idx) => (
                        <li
                          key={v.title + idx}
                          className="flex items-start gap-3 text-sm font-semibold text-black/75"
                        >
                          <span className="mt-2 inline-block h-2 w-2 shrink-0 rounded-full bg-[#F2A900]" />
                          <span className="break-words">{v.title}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="mt-3 text-sm text-black/50">Variant yoxdur.</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
