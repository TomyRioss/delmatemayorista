import HeroSlider from "@/components/landing/HeroSlider";
import PromoBanner from "@/components/landing/PromoBanner";
import TodosLosProductos from "@/components/landing/TodosLosProductos";
import { reader } from "@/lib/keystatic";

export default async function Home() {

  const categoriasRaw = await reader.collections.categorias.all();
  const categorias = categoriasRaw.map((c) => ({
    slug: c.slug,
    label: c.entry.label,
    image: c.entry.image ?? "/categorias/placeholder.png",
  }));


  return (
    <div className="flex flex-1 flex-col bg-white">
      <main className="flex flex-1 flex-col">
        <HeroSlider categories={categorias} />
        <PromoBanner />
        <TodosLosProductos />
      </main>
    </div>
  );
}
