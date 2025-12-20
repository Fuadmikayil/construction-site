"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import data from "../data/baza.json";

type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

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
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...props}
    >
      <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...props}
    >
      <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export default function Header() {
  const pathname = usePathname();
  const nav = (
    data as unknown as { nav: NavItem[]; site: { logo: string; name: string } }
  ).nav;
  const site = (
    data as unknown as { nav: NavItem[]; site: { logo: string; name: string } }
  ).site;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const headerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!headerRef.current) return;
      if (!headerRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      ref={headerRef}
      className="w-full border-b border-black/10 bg-white"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <div className="relative h-14 w-56 sm:w-64 md:h-14 md:w-64 lg:h-18 lg:w-72 overflow-hidden">
            <Image
              src={site.logo}
              alt={site.name}
              fill
              className="object-contain scale-110 md:scale-140"
              priority
            />
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 lg:flex lg:gap-10">
          {nav.map((item) => {
            const active = isActive(item.href);

            // Dropdown item (desktop hover + click)
            if (item.children?.length) {
              const opened = openDropdown === item.href;

              return (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(item.href)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    type="button"
                    onClick={() => setOpenDropdown(opened ? null : item.href)}
                    className={`group flex items-center gap-2 text-[13px] lg:text-sm font-semibold tracking-wide transition
                      ${
                        active
                          ? "text-[#F2A900]"
                          : "text-black hover:text-[#F2A900]"
                      }`}
                  >
                    {item.label}
                    <ChevronDownIcon
                      className={`h-4 w-4 transition ${
                        opened ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <span
                    className={`mt-1 block h-[2px] w-full rounded bg-[#F2A900] transition-opacity ${
                      active
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    }`}
                  />

                  {opened && (
                    <div className="absolute left-0 top-full z-50 mt-3 w-56 rounded-xl border border-black/10 bg-white p-2 shadow-lg">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`block rounded-lg px-3 py-2 text-sm transition
                            ${
                              isActive(child.href)
                                ? "bg-black/5 text-black"
                                : "hover:bg-black/5"
                            }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            // Normal item
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group text-[13px] lg:text-sm font-semibold tracking-wide transition ${
                  active ? "text-[#F2A900]" : "text-black hover:text-[#F2A900]"
                }`}
              >
                {item.label}
                <span
                  className={`mt-1 block h-[2px] w-full rounded bg-[#F2A900] transition-opacity ${
                    active ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Mobile button */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg p-2 text-black hover:bg-black/5 lg:hidden"
          aria-label="Open menu"
          onClick={() => setMobileOpen((s) => !s)}
        >
          {mobileOpen ? (
            <CloseIcon className="h-6 w-6" />
          ) : (
            <MenuIcon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="border-t border-black/10 bg-white lg:hidden">
          <div className="mx-auto max-w-7xl px-4 py-4">
            <div className="flex flex-col gap-2">
              {nav.map((item) => {
                const active = isActive(item.href);

                if (item.children?.length) {
                  const opened = openDropdown === item.href;

                  return (
                    <div
                      key={item.href}
                      className="rounded-xl border border-black/10"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setOpenDropdown(opened ? null : item.href)
                        }
                        className={`flex w-full items-center justify-between px-4 py-3 text-sm font-semibold ${
                          active ? "text-[#F2A900]" : "text-black"
                        }`}
                      >
                        <span>{item.label}</span>
                        <ChevronDownIcon
                          className={`h-4 w-4 transition ${
                            opened ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {opened && (
                        <div className="border-t border-black/10 p-2">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={`block rounded-lg px-3 py-2 text-sm transition ${
                                isActive(child.href)
                                  ? "bg-black/5"
                                  : "hover:bg-black/5"
                              }`}
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
                    className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      active
                        ? "bg-[#F2A900]/10 text-[#F2A900]"
                        : "hover:bg-black/5"
                    }`}
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
