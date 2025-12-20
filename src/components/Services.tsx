import Image from "next/image";
import Link from "next/link";
import data from "../data/baza.json";

type ServiceItem = {
  title: string;
  description: string;
  image: string;
  href: string;
  buttonText: string;
};

export default function Services() {
  const section = (data as unknown as {
    servicesSection: { title: string; items: ServiceItem[] };
  }).servicesSection;

  return (
    <section className="py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4">
        {/* Title */}
        <div className="mb-10">
          <h2 className="text-3xl font-extrabold text-white md:text-4xl">
            {section.title}
          </h2>
          <div className="mt-3 h-1 w-14 bg-[#F2A900]" />
        </div>

        {/* Grid */}
        <div className="grid gap-8 md:grid-cols-2 !text-black lg:grid-cols-3">
          {section.items.map((item) => (
            <div
              key={item.title}
              className="rounded-none border border-black/10 bg-white p-10 shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
            >
              {/* Circle image */}
              <div className="mx-auto mb-6 flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-black/5">
                <div className="relative h-full w-full">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <h3 className="text-center text-2xl font-extrabold text-black">
                {item.title}
              </h3>

              <p className="mx-auto mt-4 max-w-md text-center leading-7 text-black/60">
                {item.description}
              </p>

              <div className="mt-10 flex justify-center">
                <Link
                  href={item.href}
                  className="inline-flex items-center justify-center rounded-none bg-[#F2A900] px-7 py-3 text-sm font-semibold text-black transition hover:brightness-95"
                >
                  {item.buttonText}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
