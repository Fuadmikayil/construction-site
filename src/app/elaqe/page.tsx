"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import data from "../../data/baza.json";
import { FiMapPin, FiPhoneCall, FiMail, FiClock } from "react-icons/fi";

import { FaWhatsapp } from "react-icons/fa";

/* ================= HELPERS ================= */

function cleanText(input: unknown) {
  if (input === null || input === undefined) return "";
  return String(input)
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function toArray(v: unknown): any[] {
  return Array.isArray(v) ? v : [];
}

function onlyDigits(v: string) {
  return v.replace(/\D/g, "");
}

/* ================= PAGE ================= */

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [phone, setPhone] = useState("");

  const onPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(onlyDigits(e.target.value));
  };

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

  const fallbackCards = [
    { title: "Telefon", value: "+994 50 000 00 00", hint: "İş saatlarında", type: "phone" },
    { title: "Email", value: "info@example.com", hint: "24 saat", type: "email" },
    { title: "Ünvan", value: "Bakı, Azərbaycan", hint: "Ofis", type: "address" },
    { title: "İş Saatları", value: "09:00 - 18:00", hint: "Bazar günü - Cümə", type: "hours" },
  ];

  const form = contact.form ?? {};
  const formTitle = cleanText(form.title) || "Mesaj göndər";
  const formNote =
    cleanText(form.note) || "Formu doldurun — tez zamanda geri dönüş edək.";

  const fields = form.fields ?? {};
  const labelName = cleanText(fields.name) || "Ad Soyad";
  const labelPhone = cleanText(fields.phone) || "Telefon";
  const labelService = cleanText(fields.service) || "Xidmət seç";
  const labelMessage = cleanText(fields.message) || "Mesajınız";
  const submitText = cleanText(form.submitText) || "Göndər";

  const serviceOptions = useMemo(() => {
    const fromForm = toArray(form.services)
      .map((x) => cleanText(x))
      .filter(Boolean);
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
  const ctaSubtitle =
    cleanText(cta.subtitle) || "1 dəqiqəyə əlaqə saxlayın — məsləhət verək.";
  const ctaPrimaryText = cleanText(cta.primaryText) || "WhatsApp-a yaz";
  const ctaPrimaryHref = cleanText(cta.primaryHref) || "#";
  const ctaSecondaryText = cleanText(cta.secondaryText) || "Zəng et";
  const ctaSecondaryHref = cleanText(cta.secondaryHref) || "#";

  
  const listCards = cards.length ? cards : fallbackCards;

  const aboutText = partnersAbout?.text?.[0]
    ? cleanText(partnersAbout.text[0])
    : "";
  const aboutLogo = partnersAbout?.logo
    ? cleanText(partnersAbout.logo)
    : cleanText(site?.logoStatic);

  // ✅ BURADA öz mailini yaz
  const YOUR_EMAIL = "rashidoglu.inshaatmmc@gmail.com";

  // CTA ikonlar (emoji yox)
  const ctaMiniLinks = [
    { label: "WhatsApp", href: ctaPrimaryHref || "#", Icon: FaWhatsapp },
    { label: "Zəng", href: ctaSecondaryHref || "#", Icon: FiPhoneCall },
    { label: "Ünvan", href: "#map", Icon: FiMapPin },
    { label: "Email", href: `mailto:${YOUR_EMAIL}`, Icon: FiMail },
  ];

  return (
    <main className="bg-white">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
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

              const type = (c?.type || "").toString().toLowerCase();

              const isEmail =
                title.toLowerCase().includes("email") || type === "email";
              const isPhone =
                title.toLowerCase().includes("telefon") || type === "phone";
              const isAddress =
                title.toLowerCase().includes("ünvan") || type === "address";
              const isHours =
                title.toLowerCase().includes("iş") || type === "hours";

              const Icon = isEmail
                ? FiMail
                : isPhone
                ? FiPhoneCall
                : isAddress
                ? FiMapPin
                : isHours
                ? FiClock
                : FiMapPin;

              return (
                <div
                  key={i}
                  className="rounded-3xl border border-black/10 bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(0,0,0,0.08)]"
                >
                  <div className="flex items-start gap-4">
                    {/* ICON (boş dairə yox) */}
                    <div className="mt-1 grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#F2A900]/15 ring-1 ring-[#F2A900]/30">
                      <Icon className="h-5 w-5 text-black/70" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-bold text-black">
                        {title}
                      </div>

                      {/* VALUE: email/phone düzgün görünsün */}
                      {isEmail ? (
                        <a
                          href={`mailto:${value}`}
                          className="mt-2 block text-[14px] font-semibold text-black underline-offset-2 hover:underline truncate"
                          title={value}
                        >
                          {value}
                        </a>
                      ) : isPhone ? (
                        <a
                          href={`tel:${value.replace(/\s/g, "")}`}
                          className="mt-2 block text-[14px] font-semibold text-black underline-offset-2 hover:underline truncate"
                          title={value}
                        >
                          {value}
                        </a>
                      ) : (
                        <div
                          className="mt-2 text-[14px] font-semibold text-black truncate"
                          title={value}
                        >
                          {value}
                        </div>
                      )}

                      <div
                        className="mt-1 text-xs text-black/60 truncate"
                        title={hint}
                      >
                        {hint}
                      </div>
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
              <h2 className="text-2xl font-extrabold text-black md:text-3xl">
                {formTitle}
              </h2>
              <p className="mt-3 text-[14px] leading-7 text-black/60">
                {formNote}
              </p>

              {/* FormSubmit (API key / şifrə YOX) */}
              <form
                className="mt-8 grid grid-cols-1 gap-4"
                action={`https://formsubmit.co/${encodeURIComponent(
                  YOUR_EMAIL
                )}`}
                method="POST"
                onSubmit={() => setSent(true)}
              >
                <input
                  type="hidden"
                  name="_subject"
                  value="Saytdan yeni mesaj (Əlaqə formu)"
                />
                <input type="hidden" name="_captcha" value="false" />
                <input
                  type="hidden"
                  name="_next"
                  value={`${
                    typeof window !== "undefined" ? window.location.origin : ""
                  }/elaqe?ok=1`}
                />

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
                    value={phone}
                    onChange={onPhoneChange}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    type="tel"
                    autoComplete="tel"
                    required
                  />
                </div>

                <select
                  name="service"
                  className="h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-black outline-none transition focus:border-[#F2A900]/60 focus:ring-4 focus:ring-[#F2A900]/15"
                  defaultValue=""
                >
                  <option value="" disabled>
                    {labelService}
                  </option>
                  {serviceOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
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
                  {aboutLogo ? (
                    <Image
                      src={aboutLogo}
                      alt={cleanText(site?.name)}
                      fill
                      className="object-contain"
                    />
                  ) : null}
                </div>

                <div className="flex-1">
                  <div className="text-sm font-semibold text-black">Şirkət</div>
                  <div className="mt-1 text-xl font-extrabold text-black">
                    {cleanText(site?.name)}
                  </div>
                  {aboutText ? (
                    <p className="mt-3 text-[13px] leading-6 text-black/70">
                      {aboutText}
                    </p>
                  ) : (
                    <p className="mt-3 text-[13px] leading-6 text-black/60">
                      `partnersSection.about.text[0]` əlavə etsən burada
                      avtomatik çıxacaq.
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-7 h-px bg-black/10" />

              <div className="mt-7 grid grid-cols-1 gap-3">
                <Link
                  href="/haqqimizda"
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-black/10 bg-white text-sm font-semibold text-black transition hover:bg-black/[0.03]"
                >
                  Haqqımızda səhifəsi
                </Link>
                <Link
                  href="/mehsullar"
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-black/10 bg-white text-sm font-semibold text-black transition hover:bg-black/[0.03]"
                >
                  Məhsullara bax
                </Link>
                <Link
                  href="/xidmetler"
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-black text-sm font-semibold text-white transition hover:opacity-95"
                >
                  Xidmət seç
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MAP ================= */}
<section id="map" className="py-12 md:py-16">
  <div className="mx-auto max-w-7xl px-4">
    <div>
      <h2 className="text-3xl font-extrabold text-black">{mapTitle}</h2>
      <div className="mt-3 h-1 w-14 bg-[#F2A900]" />
    </div>

    <div className="mt-8 overflow-hidden rounded-3xl border border-black/10 bg-[#F7F7F7]">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3329.2624365466336!2d46.76505707598411!3d39.871459971532516!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMznCsDUyJzE3LjMiTiA0NsKwNDYnMDMuNSJF!5e1!3m2!1saz!2saz!4v1766319637985!5m2!1saz!2saz"
        className="h-[360px] w-full md:h-[420px]"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Google Map"
      />
    </div>
  </div>
</section>


      {/* ================= CTA STRIP ================= */}
      <section className="pb-16 md:pb-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="rounded-3xl border border-black/10 bg-[linear-gradient(90deg,rgba(242,169,0,0.18),rgba(0,0,0,0.02))] p-8 md:p-10">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-8">
                <h3 className="text-2xl font-extrabold text-black md:text-3xl">
                  {ctaTitle}
                </h3>
                <p className="mt-3 text-[14px] leading-7 text-black/70">
                  {ctaSubtitle}
                </p>
              </div>

              <div className="lg:col-span-4">
                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                  <a
                    href={ctaPrimaryHref}
                    className="inline-flex h-12 items-center justify-center rounded-xl bg-[#F2A900] px-6 text-sm font-semibold text-black transition hover:brightness-95"
                  >
                    {ctaPrimaryText}
                  </a>
                  <a
                    href={ctaSecondaryHref}
                    className="inline-flex h-12 items-center justify-center rounded-xl border border-black/10 bg-white px-6 text-sm font-semibold text-black transition hover:bg-black/[0.03]"
                  >
                    {ctaSecondaryText}
                  </a>
                </div>

                {/* ✅ ICONLAR BURADA (emoji YOX) */}
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  {ctaMiniLinks.map(({ label, href, Icon }) => (
                    <a
                      key={label}
                      href={href}
                      className="group inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2 transition hover:bg-black/[0.03]"
                      title={label}
                    >
                      <Icon className="h-5 w-5 text-black/70 transition group-hover:text-black" />
                      <span className="text-xs font-semibold text-black/80 group-hover:text-black">
                        {label}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
