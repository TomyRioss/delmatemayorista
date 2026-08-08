import HeroSlider from "@/components/landing/HeroSlider";
import PromoBanner from "@/components/landing/PromoBanner";
import TodosLosProductos from "@/components/landing/TodosLosProductos";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-white">
      <main className="flex flex-1 flex-col">
        <HeroSlider />
        <PromoBanner />
        <TodosLosProductos />
      </main>
      <Footer />
    </div>
  );
}
