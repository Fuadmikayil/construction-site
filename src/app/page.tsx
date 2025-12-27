import Image from "next/image";
import Hero from "../components/Hero";
import Services from "../components/Services";
import ProductsSlider from "../components/ProductsSlider";
import PartnersSection from "../components/PartnersSection";
////Developer: Fuad Mikayilov  instagram: @By_F37D  whatsapp: +994555407687
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
