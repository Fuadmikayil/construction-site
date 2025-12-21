"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import data from "../../data/baza.json";

/* ================= HELPERS ================= */

function cleanText(input: unknown) {
  if (input === null || input === undefined) return "";
  return String(input)
    .replace(/[\u200B-\u200D\uFEFF]/g, "") // zero-width
    .replace(/\s+/g, " ")
    .trim();
}

function toArray(v: unknown): any[] {
  return Array.isArray(v) ? v : [];
}

/* ================= PAGE ================= */

export default function ContactPage() {
  const site: any = (data as any)?.site ?? { name: "Rəşidoğlu İnşaat" };
  const partnersAbout = (data as any)?.partnersSection?.about;

  const contact: any = (data as any)?.contactSection ?? {};

  const hero = contact.hero ?? {};
  const heroTitle = cleanText(hero.title) || "Əlaqə";
  const heroSubtitle =
    cleanText(hero.subtitle) ||
    "Sifariş, qiymət və əməkdaşlıq üçün bizimlə rahat şəkildə əlaqə saxlayın.";
  const heroImage = cleanText(hero.image) || "/images/hero/slide-1.png";
  const heroBadge = cleanText(hero.badge) || "Sürətli cavab";

  const cards = toArray(contact.cards);
  const socials = toArray(contact.socials);

  const form = contact.form ?? {};
  const formTitle = cleanText(form.title) || "Mesaj göndər";
  const formNote = cleanText(form.note) || "Formu doldurun — tez zamanda geri dönüş edək.";

  const fields = form.fields ?? {};
  const labelName = cleanText(fields.name) || "Ad Soyad";
  const labelPhone = cleanText(fields.phone) || "Telefon";
  const labelService = cleanText(fields.service) || "Xidmət seç";
  const labelMessage = cleanText(fields.message) || "Mesajınız";
  const submitText = cleanText(form.submitText) || "Göndər";

  const serviceOptions = useMemo(() => {
    const fromForm = toArray(form.services).map((x) => cleanText(x)).filter(Boolean);
    if (fromForm.length) return fromForm;

    return toArray((data as any)?.servicesSection?.items)
      .map((x) => cleanText(x?.title))
      .filter(Boolean);
  }, [form.services]);

  const map = contact.map ?? {};
  const mapTitle = cleanText(map.title) || "Xəritədə bax";
  const mapEmbedUrl = cleanText(map.embedUrl);

  const cta = contact.cta ?? {};
  const ctaTitle = cleanText(cta.title) || "Qiymət və sifariş üçün";
  const ctaSubtitle = cleanText(cta.subtitle) || "1 dəqiqəyə əlaqə saxlayın — məsləhət verək.";
  const ctaPrimaryText = cleanText(cta.primaryText) || "WhatsApp-a yaz";
  const ctaPrimaryHref = cleanText(cta.primaryHref) || "#";
  const ctaSecondaryText = cleanText(cta.secondaryText) || "Zəng et";
  const ctaSecondaryHref = cleanText(cta.secondaryHref) || "#";

  const fallbackCards = [
    { title: "Ünvan", value: "Bakı, ... (ünvanı bazaya əlavə et)", hint: "Mağazaya yaxınlaşa bilərsiniz", type: "address" },
    { title: "Telefon", value: "+994 .. ... .. ..", hint: "Zəng / WhatsApp", type: "phone" },
    { title: "Email", value: "info@....az", hint: "Təklif və sorğular", type: "email" },
    { title: "İş saatı", value: "Hər gün 09:00 — 19:00", hint: "Əlavə info üçün zəng edin", type: "hours" },
  ];

  const listCards = cards.length ? cards : fallbackCards;

  const aboutText = partnersAbout?.text?.[0] ? cleanText(partnersAbout.text[0]) : "";
  const aboutLogo = partnersAbout?.logo ? cleanText(partnersAbout.logo) : cleanText(site?.logoStatic);

  /* ================= FORM STATE (sadəcə UX üçün) ================= */
  const [sent, setSent] = useState(false);

  // ✅ BURADA öz mailini yaz
  const YOUR_EMAIL = "rashidoglu.inshaatmmc@gmail.com";

  return (
    <main className="bg-white">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src={heroImage} alt={heroTitle} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-[radial-gradient(70%_70%_at_25%_15%,rgba(242,169,0,0.22)_0%,rgba(242,169,0,0)_60%)]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-14 md:py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white/90 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-[#F2A900]" />
              {heroBadge}
            </div>

            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white md:text-5xl">
              {heroTitle}
            </h1>

            <p className="mt-5 text-[15px] leading-7 text-white/90 md:text-base">
              {heroSubtitle}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/xidmetler"
                className="inline-flex items-center justify-center rounded-xl bg-[#F2A900] px-6 py-3 text-sm font-semibold text-black transition hover:brightness-95"
              >
                Xidmətlərimiz
              </Link>

              <Link
                href="/mehsullar"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
              >
                Məhsullar
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= INFO CARDS ================= */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {listCards.map((c, i) => {
              const title = cleanText(c?.title);
              const value = cleanText(c?.value);
              const hint = cleanText(c?.hint);

              const isEmail = title.toLowerCase().includes("email") || c?.type === "email";
              const isPhone = title.toLowerCase().includes("telefon") || c?.type === "phone";

              return (
                <div
                  key={i}
                  className="rounded-3xl border border-black/10 bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(0,0,0,0.08)]"
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1 h-10 w-10 shrink-0 rounded-2xl bg-[#F2A900]/15 ring-1 ring-[#F2A900]/30" />
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-black">{title}</div>

                      {/* uzun gmail pozulmasın */}
                      {isEmail ? (
                        <a
                          href={`mailto:${value}`}
                          className="mt-2 block text-[14px] font-semibold text-black break-all line-clamp-2 hover:underline"
                          title={value}
                        >
                          {value}
                        </a>
                      ) : isPhone ? (
                        <a
                          href={`tel:${value.replace(/\s/g, "")}`}
                          className="mt-2 block text-[14px] font-semibold text-black break-all line-clamp-2 hover:underline"
                          title={value}
                        >
                          {value}
                        </a>
                      ) : (
                        <div className="mt-2 text-[14px] font-semibold text-black break-words">
                          {value}
                        </div>
                      )}

                      <div className="mt-1 text-xs text-black/60">{hint}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {socials.length > 0 && (
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {socials.map((s, idx) => (
                <a
                  key={cleanText(s?.href) || idx}
                  href={cleanText(s?.href)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-black/[0.03]"
                >
                  {cleanText(s?.label)}
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================= FORM + COMPANY CARD ================= */}
      <section className="py-12 md:py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 lg:grid-cols-12 lg:gap-12">
          {/* LEFT: FORM */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-black/10 bg-white p-7 shadow-[0_15px_40px_rgba(0,0,0,0.06)] md:p-10">
              <h2 className="text-2xl font-extrabold text-black md:text-3xl">{formTitle}</h2>
              <p className="mt-3 text-[14px] leading-7 text-black/60">{formNote}</p>

              {/* ✅ FORM SUBMIT: FormSubmit-a gedir (şifrə/API key YOX) */}
              <form
                className="mt-8 grid grid-cols-1 gap-4"
                action={`https://formsubmit.co/${encodeURIComponent(YOUR_EMAIL)}`}
                method="POST"
                onSubmit={() => setSent(true)}
              >
                {/* FormSubmit config */}
                <input type="hidden" name="_subject" value="Saytdan yeni mesaj (Əlaqə formu)" />
                <input type="hidden" name="_captcha" value="false" />
                {/* İstəsən success page: /elaqe?ok=1 */}
                <input type="hidden" name="_next" value={`${typeof window !== "undefined" ? window.location.origin : ""}/elaqe?ok=1`} />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <input
                    className="h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-black outline-none transition focus:border-[#F2A900]/60 focus:ring-4 focus:ring-[#F2A900]/15"
                    placeholder={labelName}
                    name="name"
                    required
                  />
                  <input
                    className="h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-black outline-none transition focus:border-[#F2A900]/60 focus:ring-4 focus:ring-[#F2A900]/15"
                    placeholder={labelPhone}
                    name="phone"
                    required
                  />
                </div>

                <select
                  name="service"
                  className="h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-black outline-none transition focus:border-[#F2A900]/60 focus:ring-4 focus:ring-[#F2A900]/15"
                  defaultValue=""
                >
                  <option value="" disabled>{labelService}</option>
                  {serviceOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>

                <textarea
                  name="message"
                  rows={5}
                  className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-[#F2A900]/60 focus:ring-4 focus:ring-[#F2A900]/15"
                  placeholder={labelMessage}
                  required
                />

                <button
                  type="submit"
                  className="mt-2 inline-flex h-12 items-center justify-center rounded-xl bg-[#F2A900] px-6 text-sm font-semibold text-black transition hover:brightness-95"
                >
                  {submitText}
                </button>

                <div className="pt-2 text-xs text-black/50">
                  * Birinci dəfə göndərəndə FormSubmit mailinə təsdiq linki gələ bilər (1 dəfəlik).
                </div>

                {sent && (
                  <div className="text-sm font-semibold text-green-600">
                    Göndərilir... (mailə yönləndiriləcək)
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* RIGHT: COMPANY CARD */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-black/10 bg-white p-7 shadow-[0_15px_40px_rgba(0,0,0,0.06)] md:p-9">
              <div className="flex items-start gap-5">
                <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-black/10 bg-white">
                  {aboutLogo ? <Image src={aboutLogo} alt={cleanText(site?.name)} fill className="object-contain" /> : null}
                </div>

                <div className="flex-1">
                  <div className="text-sm font-semibold text-black">Şirkət</div>
                  <div className="mt-1 text-xl font-extrabold text-black">{cleanText(site?.name)}</div>
                  {aboutText ? (
                    <p className="mt-3 text-[13px] leading-6 text-black/70">{aboutText}</p>
                  ) : (
                    <p className="mt-3 text-[13px] leading-6 text-black/60">
                      `partnersSection.about.text[0]` əlavə etsən burada avtomatik çıxacaq.
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-7 h-px bg-black/10" />

              <div className="mt-7 grid grid-cols-1 gap-3">
                <Link href="/haqqimizda" className="inline-flex h-12 items-center justify-center rounded-xl border border-black/10 bg-white text-sm font-semibold text-black transition hover:bg-black/[0.03]">
                  Haqqımızda səhifəsi
                </Link>
                <Link href="/mehsullar" className="inline-flex h-12 items-center justify-center rounded-xl border border-black/10 bg-white text-sm font-semibold text-black transition hover:bg-black/[0.03]">
                  Məhsullara bax
                </Link>
                <Link href="/xidmetler" className="inline-flex h-12 items-center justify-center rounded-xl bg-black text-sm font-semibold text-white transition hover:opacity-95">
                  Xidmət seç
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MAP ================= */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div>
            <h2 className="text-3xl font-extrabold text-black">{mapTitle}</h2>
            <div className="mt-3 h-1 w-14 bg-[#F2A900]" />
          </div>

          <div className="mt-8 overflow-hidden rounded-3xl border border-black/10 bg-[#F7F7F7]">
            {mapEmbedUrl ? (
              <iframe
                src={mapEmbedUrl}
                className="h-[360px] w-full md:h-[420px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Map"
              />
            ) : (
              <div className="flex h-[360px] items-center justify-center p-6 text-center text-sm text-black/60">
                Google Maps embed linkini `baza.json → contactSection.map.embedUrl` içində əlavə et.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ================= CTA STRIP ================= */}
      <section className="pb-16 md:pb-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="rounded-3xl border border-black/10 bg-[linear-gradient(90deg,rgba(242,169,0,0.18),rgba(0,0,0,0.02))] p-8 md:p-10">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-8">
                <h3 className="text-2xl font-extrabold text-black md:text-3xl">{ctaTitle}</h3>
                <p className="mt-3 text-[14px] leading-7 text-black/70">{ctaSubtitle}</p>
              </div>

              <div className="lg:col-span-4">
                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                  <a href={ctaPrimaryHref} className="inline-flex h-12 items-center justify-center rounded-xl bg-[#F2A900] px-6 text-sm font-semibold text-black transition hover:brightness-95">
                    {ctaPrimaryText}
                  </a>
                  <a href={ctaSecondaryHref} className="inline-flex h-12 items-center justify-center rounded-xl border border-black/10 bg-white px-6 text-sm font-semibold text-black transition hover:bg-black/[0.03]">
                    {ctaSecondaryText}
                  </a>
                </div>

                <div className="mt-3 text-xs text-black/50">
                  * Linkləri `contactSection.cta` içində dəyişə bilərsən.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
