import Footer from "@/components/landing/Footer";
import TodosLosProductos from "@/components/landing/TodosLosProductos";
import { getCategorias, getProductosPorCategoria } from "@/lib/products";

type Props = {
  searchParams: Promise<{ categoria?: string }>;
};

export default async function ProductosPage({ searchParams }: Props) {
  const { categoria } = await searchParams;

  const [productos, categorias] = await Promise.all([
    getProductosPorCategoria(categoria),
    getCategorias(),
  ]);

  const categoriaActual = categoria ? categorias.find((c) => c.slug === categoria) : undefined;
  const titulo = categoriaActual ? categoriaActual.label : "Todos los productos";
  const mensajeVacio = categoria
    ? "No encontramos productos en esta categoría todavía."
    : "Todavía no hay productos cargados en el catálogo.";

  return (
    <div className="flex flex-1 flex-col bg-white">
      <main className="flex flex-1 flex-col py-2">
        <TodosLosProductos
          productos={productos}
          titulo={titulo}
          seccionId="productos"
          mensajeVacio={mensajeVacio}
        />
      </main>
      <Footer />
    </div>
  );
}
