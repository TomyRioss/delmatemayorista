import Footer from "@/components/landing/Footer";
import TodosLosProductos from "@/components/landing/TodosLosProductos";
import { getProductosEnOferta } from "@/lib/products";

export default async function OfertasPage() {
  const productos = await getProductosEnOferta();

  return (
    <div className="flex flex-1 flex-col bg-white">
      <main className="flex flex-1 flex-col py-2">
        <TodosLosProductos
          productos={productos}
          titulo="Ofertas"
          seccionId="ofertas"
          mensajeVacio="No hay productos en oferta por el momento."
        />
      </main>
      <Footer />
    </div>
  );
}
