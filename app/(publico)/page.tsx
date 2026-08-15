import BannerHeroCarousel from "@/components/landing/BannerHeroCarousel";
import HeroSlider from "@/components/landing/HeroSlider";
import PromoBanner from "@/components/landing/PromoBanner";
import ProductGrid from "@/components/landing/ProductGrid";
import { reader } from "@/lib/keystatic";
import { getProducts } from "@/lib/products";

export const revalidate = 60;

export default async function Home() {

  const categoriasRaw = await reader.collections.categorias.all();
  const categorias = categoriasRaw.map((c) => ({
    slug: c.slug,
    label: c.entry.label,
    image: c.entry.image ?? "/categorias/placeholder.png",
  }));

  const products = await getProducts();
  const banner = await reader.singletons.bannerPersonalizado.read();
  const bannerHeroRaw = await reader.collections.bannerHero.all();
  const heroSlides = bannerHeroRaw
    .map((s) => ({ imagenDesktop: s.entry.imagenDesktop, imagenMobile: s.entry.imagenMobile, link: s.entry.link }))
    .filter((s): s is { imagenDesktop: string; imagenMobile: string; link: string } =>
      Boolean(s.imagenDesktop && s.imagenMobile)
    );

  return (
    <div className="flex flex-1 flex-col bg-white">
      <main className="flex flex-1 flex-col">
        <BannerHeroCarousel slides={heroSlides} />
        <HeroSlider categories={categorias} />
        <PromoBanner imagenDesktop={banner?.imagenDesktop} imagenMobile={banner?.imagenMobile} />
        <ProductGrid products={products} title="Todos los productos" />
      </main>
    </div>
  );
}
