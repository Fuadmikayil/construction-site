import Image from "next/image";
import Hero from "../components/Hero";
import Services from "../components/Services";
import ProductsSlider from "../components/ProductsSlider";
import PartnersSection from "../components/PartnersSection";

export default function Home() {
  return (
    <main  >
    <Hero />
    <Services />
     <ProductsSlider />
     <PartnersSection />
    </main>

  );
}
