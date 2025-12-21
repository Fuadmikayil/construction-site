import Image from "next/image";
import Link from "next/link";
import data from "../../data/baza.json";
import { FiArrowUpRight, FiCheckCircle, FiTool } from "react-icons/fi";

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

/* ================= PAGE ================= */

export default function ServicesPage() {
  const site: any = (data as any)?.site ?? { name: "Rəşidoğlu İnşaat" };
  const servicesSection: any = (data as any)?.servicesSection ?? {};
  const title = cleanText(servicesSection?.title) || "Xidmətlərimiz";
  const items = toArray<any>(servicesSection?.items);

  // fallback (əgər items boşdursa)
  const list =
    items.length > 0
      ? items
      : [
          {
            title: "Plastik Sexi",
            description: "Plastikdən qapı pencərə istehsalı",
            image: "/images/services/default.jpg",
            href: "/xidmetler/plastik",
            buttonText: "Daha ətraflı",
          },
          {
            title: "Qaynaq Sexi",
            description: "Dəmir qapı, darvaza, raşotka, məhəccər hazırlanması",
            image: "/images/services/default.jpg",
            href: "/xidmetler/qaynaq",
            buttonText: "Daha ətraflı",
          },
          {
            title: "Taxta Sexi",
            description: "Müxtəlif taxta məhsullarının istehsalı",
            image: "/images/services/default.jpg",
            href: "/xidmetler/taxta",
            buttonText: "Daha ətraflı",
          },
        ];

  return (
    <main className="bg-white">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_20%_10%,rgba(242,169,0,0.18)_0%,rgba(242,169,0,0)_60%),radial-gradient(55%_55%_at_80%_20%,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0)_60%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-[#F7F7F7]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-14 md:py-20">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-black/70">
                <span className="h-2 w-2 rounded-full bg-[#F2A900]" />
                {cleanText(site?.name)}
              </div>

              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-black md:text-5xl">
                {title}
              </h1>

              <p className="mt-5 max-w-2xl text-[15px] leading-7 text-black/70 md:text-base">
                Plastik, qaynaq və taxta sexlərimizdə sifarişlər peşəkar ustalar və müasir avadanlıqlarla hazırlanır.
                Keyfiyyət, təhlükəsizlik və uzunömürlülük bizim əsas prioritetlərimizdir.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/elaqe"
                  className="inline-flex items-center justify-center rounded-xl bg-[#F2A900] px-6 py-3 text-sm font-semibold text-black transition hover:brightness-95"
                >
                  Əlaqə saxla
                </Link>
                <Link
                  href="/mehsullar"
                  className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-black/[0.03]"
                >
                  Məhsullar
                </Link>
              </div>

              {/* mini bullets */}
              <div className="mt-10 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  "Fərdi ölçü və dizayn",
                  "Keyfiyyətə nəzarət",
                  "Sürətli icra",
                  "Zəmanətli iş",
                ].map((x) => (
                  <div
                    key={x}
                    className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white px-4 py-3"
                  >
                    <FiCheckCircle className="h-5 w-5 text-black/70" />
                    <span className="text-sm font-semibold text-black/80">{x}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right card */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-black/10 bg-white p-7 shadow-[0_15px_40px_rgba(0,0,0,0.08)]">
                <div className="flex items-start gap-4">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#F2A900]/15 ring-1 ring-[#F2A900]/30">
                    <FiTool className="h-5 w-5 text-black/70" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-black">Xidmət seçin</div>
                    <div className="mt-2 text-[13px] leading-6 text-black/70">
                      Aşağıdakı bölmələrdən birini açın və “Daha ətraflı” ilə xidmətin detallarına baxın.
                    </div>
                  </div>
                </div>

                <div className="mt-6 h-px bg-black/10" />

                <div className="mt-6 grid grid-cols-1 gap-3">
                  {list.slice(0, 3).map((it: any) => (
                    <Link
                      key={cleanText(it?.href) || cleanText(it?.title)}
                      href={cleanText(it?.href) || "/xidmetler"}
                      className="group flex items-center justify-between rounded-2xl border border-black/10 bg-white px-4 py-3 transition hover:bg-black/[0.03]"
                    >
                      <span className="text-sm font-semibold text-black">
                        {cleanText(it?.title)}
                      </span>
                      <FiArrowUpRight className="h-4 w-4 text-black/60 transition group-hover:text-black" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SERVICES GRID ================= */}
      <section className="py-14 md:py-18">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-end justify-between gap-6">
            <div>
              <h2 className="text-3xl font-extrabold text-black">Bölmələr</h2>
              <div className="mt-3 h-1 w-14 bg-[#F2A900]" />
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {list.map((it: any, idx: number) => {
              const t = cleanText(it?.title) || `Xidmət ${idx + 1}`;
              const d = cleanText(it?.description);
              const img = cleanText(it?.image) || "/images/services/default.jpg";
              const href = cleanText(it?.href) || "/xidmetler";
              const btn = cleanText(it?.buttonText) || "Daha ətraflı";

              return (
                <div
                  key={href + t}
                  className="group overflow-hidden rounded-3xl border border-black/10 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(0,0,0,0.08)]"
                >
                  <div className="relative h-52 w-full">
                    <Image src={img} alt={t} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/0 opacity-0 transition group-hover:opacity-100" />
                  </div>

                  <div className="p-6">
                    <div className="text-xl font-extrabold text-black">{t}</div>
                    <p className="mt-2 text-[14px] leading-7 text-black/70">
                      {d || "Ətraflı məlumat üçün bölməyə daxil olun."}
                    </p>

                    <div className="mt-5">
                      <Link
                        href={href}
                        className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-95"
                      >
                        {btn}
                        <FiArrowUpRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* bottom note */}
          <div className="mt-10 rounded-3xl border border-black/10 bg-[#F7F7F7] p-6 text-sm text-black/70">
            * Sifariş vermək və qiymət almaq üçün{" "}
            <Link href="/elaqe" className="font-semibold text-black underline underline-offset-4">
              Əlaqə
            </Link>{" "}
            bölməsinə keçin.
          </div>
        </div>
      </section>
    </main>
  );
}
