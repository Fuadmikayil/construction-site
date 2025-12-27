import Image from "next/image";
import Link from "next/link";
import data from "../../data/baza.json";

import {
  FiCheckCircle,
  FiShield,
  FiTool,
  FiLayers,
  FiUsers,
  FiAward,
  FiMapPin,
  FiArrowRight,
} from "react-icons/fi";

/* ================= TYPES ================= */

type PartnerLogo = { name: string; src: string };

type PartnersSection = {
  title?: string;
  about: {
    logo: string;
    text: string[];
    signature: string;
  };
  logos?: PartnerLogo[];
};

/* ================= HELPERS ================= */

function cleanText(input?: unknown) {
  if (input == null) return "";
  return String(input)
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export default function AboutPage() {
  const partnersSection = (data as any)?.partnersSection as PartnersSection | undefined;
  const about = partnersSection?.about;

  if (!about) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-20">
        <h1 className="text-3xl font-extrabold text-black">Haqqımızda</h1>
        <p className="mt-3 text-black/70">
          `baza.json` içində `partnersSection.about` tapılmadı.
        </p>
      </main>
    );
  }

  const paragraphs = Array.isArray(about.text) ? about.text : [];
  const signature = cleanText(about.signature);
  const logos = partnersSection?.logos ?? [];

  const highlights = [
    { title: "Təcrübə + etibar", desc: paragraphs[0] || "", Icon: FiAward },
    { title: "Sexlər və istehsal", desc: paragraphs[1] || "", Icon: FiTool },
    { title: "Zəmanət", desc: paragraphs[2] || "", Icon: FiShield },
    { title: "Bir ünvandan həll", desc: paragraphs[3] || "", Icon: FiLayers },
  ];

  const stats = [
    { k: "25+", v: "İl təcrübə", Icon: FiCheckCircle },
    { k: "3", v: "Sex fəaliyyəti", Icon: FiTool },
    { k: "700+", v: "Sifariş", Icon: FiUsers },
    { k: "1", v: "Ünvandan xidmət", Icon: FiMapPin },
  ];

  return (
    <main className="bg-white">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_20%_10%,rgba(242,169,0,0.18)_0%,rgba(242,169,0,0)_60%),radial-gradient(55%_55%_at_80%_20%,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0)_60%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-[#F7F7F7]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-14 md:py-20">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Left */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-black/70">
                <span className="h-2 w-2 rounded-full bg-[#F2A900]" />
                Haqqımızda
              </div>

              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-black md:text-5xl">
                {signature}
              </h1>

              <p className="mt-5 max-w-2xl text-[15px] leading-7 text-black/70 md:text-base">
                {cleanText(paragraphs[0])}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/elaqe"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F2A900] px-6 py-3 text-sm font-semibold text-black transition hover:brightness-95"
                >
                  Əlaqə saxla <FiArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/xidmetler"
                  className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-black/[0.03]"
                >
                  Xidmətlərimiz
                </Link>
              </div>

              {/* mini stats */}
              <div className="mt-10 grid max-w-xl grid-cols-2 gap-4 sm:grid-cols-4">
                {stats.map((s) => (
                  <div
                    key={s.v}
                    className="rounded-2xl border border-black/10 bg-white px-4 py-4"
                  >
                    <div className="flex items-center gap-2">
                      <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#F2A900]/15 ring-1 ring-[#F2A900]/30">
                        <s.Icon className="h-5 w-5 text-black/70" />
                      </div>
                      <div className="text-2xl font-extrabold text-black">{s.k}</div>
                    </div>
                    <div className="mt-2 text-xs font-medium text-black/60">{s.v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right card */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-black/10 bg-white p-7 shadow-[0_15px_40px_rgba(0,0,0,0.08)]">
                <div className="flex items-start gap-5">
                  <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-black/10 bg-white">
                    <Image
                      src={cleanText(about.logo)}
                      alt={signature}
                      fill
                      className="object-contain"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="text-sm font-semibold text-black">Şirkət profili</div>
                    <div className="mt-2 text-[13px] leading-6 text-black/70">
                      {cleanText(paragraphs[1])}
                    </div>
                  </div>
                </div>

                <div className="mt-6 h-px bg-black/10" />

                <div className="mt-6 space-y-3 text-[13px] leading-6 text-black/70">
                  <p className="italic">{cleanText(paragraphs[2])}</p>
                  <p className="italic">{cleanText(paragraphs[3])}</p>
                </div>

                <div className="mt-7 text-sm font-extrabold text-black">{signature}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-14 md:py-18">
        <div className="mx-auto max-w-7xl px-4">
          <div>
            <h2 className="text-3xl font-extrabold text-black">Niyə biz?</h2>
            <div className="mt-3 h-1 w-14 bg-[#F2A900]" />
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {highlights.map((h) => (
              <div
                key={h.title}
                className="rounded-3xl border border-black/10 bg-white p-7 transition hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(0,0,0,0.08)]"
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1 grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#F2A900]/15 ring-1 ring-[#F2A900]/30">
                    <h.Icon className="h-5 w-5 text-black/70" />
                  </div>

                  <div>
                    <div className="text-lg font-extrabold text-black">{h.title}</div>
                    <p className="mt-2 text-[14px] leading-7 text-black/70">
                      {cleanText(h.desc)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      {logos.length > 0 && (
        <section className="bg-[#F7F7F7] py-14 md:py-18">
          <div className="mx-auto max-w-7xl px-4">
            <div>
              <h2 className="text-3xl font-extrabold text-black">
                {cleanText(partnersSection?.title) || "Bizim tərəfdaşlarımız"}
              </h2>
              <div className="mt-3 h-1 w-14 bg-[#F2A900]" />
            </div>

            <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
              {logos.map((l) => (
                <div
                  key={l.name}
                  className="rounded-2xl border border-black/10 bg-white p-5 transition hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)]"
                  title={l.name}
                >
                  <div className="relative h-10 w-full">
                    <Image
                      src={cleanText(l.src)}
                      alt={cleanText(l.name)}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
