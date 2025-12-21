import Image from "next/image";
import Link from "next/link";
import data from "../data/baza.json";
import { FiMapPin, FiPhoneCall, FiMail, FiClock, FiExternalLink } from "react-icons/fi";
import { FaWhatsapp, FaInstagram, FaTiktok, FaFacebook, FaLinkedin } from "react-icons/fa";

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

function digitsOnly(v: string) {
  return v.replace(/\D/g, "");
}

function isExternal(href: string) {
  return /^https?:\/\//i.test(href) || href.startsWith("mailto:") || href.startsWith("tel:");
}

function findCard(cards: any[], key: "ünvan" | "telefon" | "email" | "iş") {
  const k = key.toLowerCase();
  return cards.find((c) => cleanText(c?.title).toLowerCase().includes(k));
}

// embed url -> açıq maps link
function embedToMapsLink(embedUrl: string) {
  const u = cleanText(embedUrl);
  if (!u) return "";
  // sadə üsul: embed-url-ni elə özü açmaq olur, amma daha yaxşısı "google.com/maps" linki çıxarmaq
  // pb paramı varsa, onu maps linkinə keçirək:
  const pbMatch = u.match(/pb=([^&]+)/);
  if (pbMatch?.[1]) {
    return `https://maps.app.goo.gl/kDf82EsXG2rF3ud8A`;
  }
  return u;
}

function socialIcon(label: string) {
  const l = cleanText(label).toLowerCase();
  if (l.includes("whatsapp")) return FaWhatsapp;
  if (l.includes("instagram")) return FaInstagram;
  if (l.includes("tiktok")) return FaTiktok;
  if (l.includes("facebook")) return FaFacebook;
  if (l.includes("linkedin")) return FaLinkedin;
  return FiExternalLink;
}

/* ================= FOOTER ================= */

export default function Footer() {
  const site: any = (data as any)?.site ?? { name: "Rəşidoğlu İnşaat", logoStatic: "" };
  const nav = toArray<any>((data as any)?.nav);

  const contact: any = (data as any)?.contactSection ?? {};
  const cards = toArray<any>(contact?.cards);
  const socials = toArray<any>(contact?.socials);

  const address = findCard(cards, "ünvan");
  const phone = findCard(cards, "telefon");
  const email = findCard(cards, "email");
  const hours = findCard(cards, "iş");

  const mapEmbed = cleanText(contact?.map?.embedUrl);
  const mapLink = embedToMapsLink(mapEmbed);

  const phoneValue = cleanText(phone?.value);
  const telHref = phoneValue ? `tel:${digitsOnly(phoneValue)}` : "#";

  const emailValue = cleanText(email?.value);
  const mailHref = emailValue ? `mailto:${emailValue}` : "#";

  // nav -> flat link list (services children-ləri də daxil)
  const menuLinks = nav.flatMap((item: any) => {
    const children = toArray<any>(item?.children);
    if (children.length) {
      return [
        { label: cleanText(item?.label) || "Xidmətlər", href: cleanText(item?.href) || "/xidmetler" },
        ...children.map((c) => ({ label: cleanText(c?.label), href: cleanText(c?.href) })),
      ].filter((x) => x.label && x.href);
    }
    return [{ label: cleanText(item?.label), href: cleanText(item?.href) }].filter((x) => x.label && x.href);
  });

  return (
    <footer className="border-t border-black/10 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* BRAND */}
          <div className="md:col-span-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="relative h-10 w-44 overflow-hidden">
                {site?.logoStatic ? (
                  <Image src={cleanText(site.logoStatic)} alt={cleanText(site.name)} fill className="object-contain" />
                ) : null}
              </div>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-black/70">
              Keyfiyyət və etibar prinsipimizdir. Sifariş, qiymət və əməkdaşlıq üçün bizimlə əlaqə saxlayın.
            </p>

            {/* SOCIALS */}
            {socials.length > 0 && (
              <div className="mt-5 flex flex-wrap items-center gap-2">
                {socials.map((s: any, idx: number) => {
                  const label = cleanText(s?.label) || `Social ${idx + 1}`;
                  const href = cleanText(s?.href);
                  if (!href) return null;

                  const Icon = socialIcon(label);

                  return (
                    <a
                      key={label + href}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="group inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-black/80 transition hover:bg-black/[0.03]"
                      title={label}
                    >
                      <Icon className="h-4 w-4 text-black/70 transition group-hover:text-black" />
                      <span>{label}</span>
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* MENU */}
          <div className="md:col-span-4">
            <div className="text-sm font-extrabold text-black">Menyu</div>
            <div className="mt-4 grid grid-cols-1 gap-2">
              {menuLinks.map((l) => {
                const label = cleanText(l.label);
                const href = cleanText(l.href);

                const LinkComp = isExternal(href) ? "a" : Link;

                // external ehtimalı azdır, amma hər ehtimala
                return isExternal(href) ? (
                  <a
                    key={label + href}
                    href={href}
                    className="text-sm font-semibold text-black/70 transition hover:text-black"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {label}
                  </a>
                ) : (
                  <Link key={label + href} href={href} className="text-sm font-semibold text-black/70 transition hover:text-black">
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* CONTACT */}
          <div className="md:col-span-4">
            <div className="text-sm font-extrabold text-black">Əlaqə</div>

            <div className="mt-4 space-y-3">
              {/* Address */}
              {address?.value ? (
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 grid h-9 w-9 place-items-center rounded-xl bg-[#F2A900]/15 ring-1 ring-[#F2A900]/30">
                    <FiMapPin className="h-4 w-4 text-black/70" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-black/60">Ünvan</div>
                    <div className="mt-1 text-sm font-semibold text-black break-words">
                      {cleanText(address.value)}
                    </div>
                    {mapLink ? (
                      <a
                        href={mapLink}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-black/70 hover:text-black"
                      >
                        Xəritədə aç <FiExternalLink className="h-3.5 w-3.5" />
                      </a>
                    ) : null}
                  </div>
                </div>
              ) : null}

              {/* Phone */}
              {phoneValue ? (
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 grid h-9 w-9 place-items-center rounded-xl bg-[#F2A900]/15 ring-1 ring-[#F2A900]/30">
                    <FiPhoneCall className="h-4 w-4 text-black/70" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-black/60">Telefon</div>
                    <a
                      href={telHref}
                      className="mt-1 block text-sm font-semibold text-black/80 hover:text-black truncate"
                      title={phoneValue}
                    >
                      {phoneValue}
                    </a>
                  </div>
                </div>
              ) : null}

              {/* Email */}
              {emailValue ? (
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 grid h-9 w-9 place-items-center rounded-xl bg-[#F2A900]/15 ring-1 ring-[#F2A900]/30">
                    <FiMail className="h-4 w-4 text-black/70" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-black/60">Email</div>
                    <a
                      href={mailHref}
                      className="mt-1 block text-sm font-semibold text-black/80 hover:text-black break-all"
                      title={emailValue}
                    >
                      {emailValue}
                    </a>
                  </div>
                </div>
              ) : null}

              {/* Hours */}
              {hours?.value ? (
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 grid h-9 w-9 place-items-center rounded-xl bg-[#F2A900]/15 ring-1 ring-[#F2A900]/30">
                    <FiClock className="h-4 w-4 text-black/70" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-black/60">İş saatı</div>
                    <div className="mt-1 text-sm font-semibold text-black/80">
                      {cleanText(hours.value)}
                    </div>
                    {hours?.hint ? (
                      <div className="mt-1 text-xs text-black/60">{cleanText(hours.hint)}</div>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* bottom bar */}
        <div className="mt-10 flex flex-col gap-3 border-t border-black/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-black/50">
            © {new Date().getFullYear()} {cleanText(site?.name)}. Bütün hüquqlar qorunur.
          </div>
          <div className="text-xs text-black/50">
            Sayt: <span className="font-semibold text-black/60">Rəşidoğlu İnşaat</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
