import HeroSlider from "@/components/landing/HeroSlider";
import PromoBanner from "@/components/landing/PromoBanner";
import TodosLosProductos from "@/components/landing/TodosLosProductos";
import Footer from "@/components/landing/Footer";
import { getCategorias, getProductos } from "@/lib/products";

export default async function Home() {
  const [categorias, productos] = await Promise.all([getCategorias(), getProductos()]);

  return (
    <div className="flex flex-1 flex-col bg-white">
      <main className="flex flex-1 flex-col">
        <HeroSlider categories={categorias} />
        <PromoBanner />
        <TodosLosProductos
          productos={productos}
          mensajeVacio="Todavía no hay productos cargados en el catálogo."
        />
      </main>
      <Footer />
    </div>
  );
}
