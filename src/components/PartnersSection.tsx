"use client";

import Image from "next/image";
import data from "../data/baza.json";

type PartnerLogo = { name: string; src: string };
type PartnersSectionData = {
  title: string;
  about: { logo: string; text: string[]; signature: string };
  logos: PartnerLogo[];
};

export default function PartnersSection() {
  const section = (data as unknown as { partnersSection: PartnersSectionData }).partnersSection;

  if (!section) return null;

  return (
    <section className=" py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          {/* LEFT: About card */}
          <div className="lg:col-span-7 !text-black ">
            <div className="bg-[#F3F3F3] rounded-2xl p-8 md:p-10">
              <div className="flex flex-col gap-8 md:flex-row md:items-start">
                <div className="shrink-0">
                  <div className="relative h-28 w-28 overflow-hidden rounded-full bg-white">
                    <Image
                      src={section.about.logo}
                      alt="Company logo"
                      fill
                      className="object-contain scale-100!"
                      priority={false}
                    />
                  </div>
                </div>

                <div className="flex-1">
                  <div className="space-y-4 text-[15px] leading-7  text-black/60">
                    {section.about.text.map((p, i) => (
                      <p key={i} className="italic">
                        {p}
                      </p>
                    ))}
                  </div>

                  <div className="mt-8 text-lg font-extrabold text-black">
                    {section.about.signature}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Partners */}
          <div className="lg:col-span-5">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
                {section.title}
              </h2>
              <div className="mt-3 h-1 w-14 bg-[#F2A900]" />
            </div>

            <div className="mt-10 grid grid-cols-2 gap-x-10 gap-y-10 sm:grid-cols-3">
              {section.logos.map((logo) => (
                <div
                  key={logo.name}
                  className="group flex items-center justify-center"
                  title={logo.name}
                >
                  <div className="relative h-34 bg-white  rounded-full w-36 opacity-90 transition group-hover:opacity-100">
                    <Image
                      src={logo.src}
                      alt={logo.name}
                      fill
                      className="object-contain rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>

         
            
          </div>
        </div>
      </div>
    </section>
  );
}
