import HeroSlider from "@/components/landing/HeroSlider";
import PromoBanner from "@/components/landing/PromoBanner";
import CategoryGrid from "@/components/landing/CategoryGrid";
import ProductSection from "@/components/landing/ProductSection";
import WholesaleBanner from "@/components/landing/WholesaleBanner";
import Footer from "@/components/landing/Footer";

const ofertas = [
  { name: "Mate imperial cuero", price: "$8.500", badge: "-20%" },
  { name: "Bombilla acero premium", price: "$3.200", badge: "-15%" },
  { name: "Termo 1L acero", price: "$12.000", badge: "-10%" },
  { name: "Yerbera + azucarera", price: "$5.400", badge: "-25%" },
];

const masVendidos = [
  { name: "Mate torpedo camionero", price: "$6.800" },
  { name: "Set mate + bombilla", price: "$9.900" },
  { name: "Termo 1L con manija", price: "$13.500" },
  { name: "Mate calabaza forrado", price: "$7.200" },
];

const novedades = [
  { name: "Mate porcelana artesanal", price: "$10.400" },
  { name: "Bombilla pico loro", price: "$3.800" },
  { name: "Kit mate + termo regalo", price: "$18.900" },
  { name: "Yerbera acero inoxidable", price: "$4.600" },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-white">
      <main className="flex flex-1 flex-col">
        <HeroSlider />
        <PromoBanner />
        <CategoryGrid />
        <ProductSection
          id="ofertas"
          title="Ofertas relámpago"
          products={ofertas}
          ctaLabel="Ver más ofertas"
          ctaHref="/ofertas"
        />
        <WholesaleBanner />
        <ProductSection
          id="vendidos"
          title="Lo más vendido"
          products={masVendidos}
          ctaLabel="Ver más vendidos"
          ctaHref="/mas-vendidos"
        />
        <ProductSection
          id="novedades"
          title="Nuevos ingresos"
          products={novedades}
          ctaLabel="Ver novedades"
          ctaHref="/novedades"
        />
      </main>
      <Footer />
    </div>
  );
}
