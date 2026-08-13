import { reader } from "@/lib/keystatic";

export type Categoria = {
  slug: string;
  label: string;
  image: string;
};

export type Producto = {
  slug: string;
  nombre: string;
  precio: number;
  precioFormateado: string;
  imagenes: string[];
  descripcion: string;
  cantidadMinima: number;
  destacado: boolean;
  categoriaSlug: string | null;
  categoriaLabel: string;
  enOferta: boolean;
  precioOferta: number | null;
  precioOfertaFormateado: string | null;
};

function formatearPrecio(valor: number): string {
  try {
    return valor.toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    });
  } catch (error) {
    console.error("Error formateando precio", error);
    return `$${valor}`;
  }
}

/**
 * Lee la colección "categorias" desde Keystatic.
 */
export async function getCategorias(): Promise<Categoria[]> {
  try {
    const categoriasRaw = await reader.collections.categorias.all();

    return categoriasRaw.map((categoria) => ({
      slug: categoria.slug,
      label: categoria.entry.label,
      image: categoria.entry.image ?? "/categorias/placeholder.png",
    }));
  } catch (error) {
    console.error("Error leyendo categorías desde Keystatic", error);
    return [];
  }
}

/**
 * Lee la colección "productos" desde Keystatic, cruzando cada producto
 * con su categoría para resolver el label, y ordena destacados primero.
 */
export async function getProductos(): Promise<Producto[]> {
  try {
    const [productosRaw, categorias] = await Promise.all([
      reader.collections.productos.all(),
      getCategorias(),
    ]);

    const categoriaPorSlug = new Map(categorias.map((c) => [c.slug, c.label]));

    const productos: Producto[] = productosRaw.map((producto) => {
      const precio = producto.entry.precio ?? 0;
      const tienePrecioOferta = Boolean(producto.entry.precioOferta) && producto.entry.precioOferta! > 0;
      const enOferta = Boolean(producto.entry.enOferta) && tienePrecioOferta;
      const precioOferta = enOferta ? producto.entry.precioOferta! : null;
      const categoriaSlug = producto.entry.categoria;

      return {
        slug: producto.slug,
        nombre: producto.entry.nombre,
        precio,
        precioFormateado: formatearPrecio(precio),
        imagenes: (producto.entry.imagenes ?? []).filter(
          (img): img is string => typeof img === "string" && img.length > 0
        ),
        descripcion: producto.entry.descripcion ?? "",
        cantidadMinima:
          producto.entry.cantidadMinima && producto.entry.cantidadMinima > 0
            ? producto.entry.cantidadMinima
            : 1,
        destacado: Boolean(producto.entry.destacado),
        categoriaSlug,
        categoriaLabel: categoriaSlug ? categoriaPorSlug.get(categoriaSlug) ?? "" : "",
        enOferta,
        precioOferta,
        precioOfertaFormateado: precioOferta !== null ? formatearPrecio(precioOferta) : null,
      };
    });

    return productos.sort((a, b) => Number(b.destacado) - Number(a.destacado));
  } catch (error) {
    console.error("Error leyendo productos desde Keystatic", error);
    return [];
  }
}

/**
 * Devuelve productos filtrados por el slug de categoría (via ?categoria=slug).
 * Si no se pasa slug, devuelve todos los productos.
 */
export async function getProductosPorCategoria(categoriaSlug?: string): Promise<Producto[]> {
  const productos = await getProductos();
  if (!categoriaSlug) return productos;
  return productos.filter((producto) => producto.categoriaSlug === categoriaSlug);
}

/**
 * Devuelve solo los productos marcados como "en oferta" desde el CMS.
 */
export async function getProductosEnOferta(): Promise<Producto[]> {
  const productos = await getProductos();
  return productos.filter((producto) => producto.enOferta);
}
