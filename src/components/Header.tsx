"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import data from "../data/baza.json";

/* ================= TYPES ================= */

type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

type SiteData = {
  name: string;
  logoStatic: string;   // /images/logo.png
  logoAnimated: string; // /images/logo.gif
};

/* ================= ICONS ================= */

function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

/* ================= HEADER ================= */

export default function Header() {
  const pathname = usePathname();
  const { nav, site } = data as { nav: NavItem[]; site: SiteData };

  const [mobileOpen, setMobileOpen] = useState(false);

  // desktop dropdown (hover) + mobile dropdown (click) üçün eyni state
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // logo gif control
  const [playLogo, setPlayLogo] = useState(false);
  const [gifKey, setGifKey] = useState(0);

  const headerRef = useRef<HTMLDivElement | null>(null);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  // Sarı xətt yalnız bu label altında olsun:
  const SERVICES_LABEL = "Xidmətlər";

  /* route dəyişəndə menyu bağlansın */
  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  /* outside click dropdown bağlasın */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!headerRef.current) return;
      if (!headerRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* LOGO GIF: girişdə + hər 4 dəq */
  useEffect(() => {
    const GIF_DURATION = 3000; // 3 saniyə oynasın
    const INTERVAL = 240000;   // 4 dəqiqə

    let timeoutId: number | null = null;

    const play = () => {
      if (timeoutId) window.clearTimeout(timeoutId);

      // gif restart (remount)
      setGifKey((k) => k + 1);
      setPlayLogo(true);

      timeoutId = window.setTimeout(() => {
        setPlayLogo(false);
      }, GIF_DURATION);
    };

    play(); // ilk girişdə 1 dəfə

    const intervalId = window.setInterval(play, INTERVAL);

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 w-full border-b border-black/10 bg-white/80 text-black backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* LOGO */}
        <Link href="/" className="flex items-center">
          <div className="relative h-14 w-56 overflow-hidden sm:w-64 md:w-64 lg:h-16 lg:w-72">
            {playLogo ? (
              <Image
                key={gifKey}
                src={site.logoAnimated}
                alt={site.name}
                fill
                className="object-contain"
                priority
                unoptimized
              />
            ) : (
              <Image
                src={site.logoStatic}
                alt={site.name}
                fill
                className="object-contain"
                priority
              />
            )}
          </div>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden items-center gap-6 lg:flex lg:gap-10">
          {nav.map((item) => {
            const opened = openDropdown === item.href;

            // Dropdown item (hover ONLY)
            if (item.children?.length) {
              const showYellowLine = item.label === SERVICES_LABEL;

              return (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(item.href)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  {/* Trigger (click yoxdur) */}
                  <div className="group inline-flex cursor-default items-center gap-2 text-sm font-semibold text-black">
                    <span className="relative">
                      {item.label}

                      {/* Sarı xətt yalnız Xidmətlər üçün */}
                      {showYellowLine && (
                        <span
                          className={`absolute -bottom-2 left-0 h-[2px] w-full bg-[#F2A900] transition-opacity ${
                            opened ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                          }`}
                        />
                      )}
                    </span>

                    <ChevronDownIcon
                      className={`h-4 w-4 transition ${opened ? "rotate-180" : ""}`}
                    />
                  </div>

                  {/* ✅ Hover bridge: trigger ↔ dropdown arası boşluqda itirməsin */}
                  <div className="absolute left-0 top-full h-4 w-56" />

                  {/* Dropdown panel */}
                  {opened && (
                    <div className="absolute left-0 top-full z-50 mt-4 w-56 rounded-xl border border-black/10 bg-white p-2 shadow-xl">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
                            isActive(child.href) ? "bg-black/5" : "hover:bg-black/5"
                          }`}
                          onClick={() => setOpenDropdown(null)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            // Normal item (sarı xətt YOX)
            return (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-semibold text-black hover:text-black"
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* MOBILE BUTTON */}
        <button
          type="button"
          className="rounded-lg p-2 text-black hover:bg-black/5 lg:hidden"
          onClick={() => setMobileOpen((s) => !s)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </div>

      {/* MOBILE PANEL */}
      {mobileOpen && (
        <div className="border-t border-black/10 bg-white lg:hidden">
          <div className="mx-auto max-w-7xl px-4 py-4">
            <div className="flex flex-col gap-2">
              {nav.map((item) => {
                const opened = openDropdown === item.href;

                if (item.children?.length) {
                  return (
                    <div key={item.href} className="rounded-xl border border-black/10">
                      <button
                        type="button"
                        className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-black"
                        onClick={() => setOpenDropdown(opened ? null : item.href)}
                      >
                        <span>{item.label}</span>
                        <ChevronDownIcon className={`h-4 w-4 transition ${opened ? "rotate-180" : ""}`} />
                      </button>

                      {opened && (
                        <div className="border-t border-black/10 p-2">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
                                isActive(child.href) ? "bg-black/5" : "hover:bg-black/5"
                              }`}
                              onClick={() => {
                                setMobileOpen(false);
                                setOpenDropdown(null);
                              }}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-xl px-4 py-3 text-sm font-semibold text-black hover:bg-black/5"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
