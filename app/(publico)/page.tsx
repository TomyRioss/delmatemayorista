import BannerHeroCarousel from "@/components/landing/BannerHeroCarousel";
import HeroSlider from "@/components/landing/HeroSlider";
import PromoBanner from "@/components/landing/PromoBanner";
import ProductGrid from "@/components/landing/ProductGrid";
import { getBannerHero, getBannerSimple, getVentanas, pbFileUrl } from "@/lib/pb";
import { getProducts, getCategoriasView } from "@/lib/products";
import { isPocketBaseReachable } from "@/lib/pb-health";

export const revalidate = 60;

function withFallback<T>(request: Promise<T>, fallback: T): Promise<T> {
  return request.catch(() => fallback);
}

export default async function Home() {
  const pbUrl = process.env.POCKETBASE_URL ?? "http://127.0.0.1:8096";
  const pbAvailable = await isPocketBaseReachable(pbUrl);
  type HomeData = [
    Awaited<ReturnType<typeof getCategoriasView>>,
    Awaited<ReturnType<typeof getProducts>>,
    Awaited<ReturnType<typeof getBannerHero>>,
    Awaited<ReturnType<typeof getBannerSimple>>,
    Awaited<ReturnType<typeof getBannerSimple>>,
    Awaited<ReturnType<typeof getVentanas>>,
  ];
  const emptyData: HomeData = [[], [], [], null, null, []];
  const data: HomeData = pbAvailable
    ? await Promise.all([
      withFallback(getCategoriasView(), []),
      withFallback(getProducts(), []),
      withFallback(getBannerHero(), []),
      withFallback(getBannerSimple("personalizado"), null),
      withFallback(getBannerSimple("como_comprar"), null),
      withFallback(getVentanas(), []),
    ])
    : emptyData;
  const [categorias, products, bannerHeroRaw, banner, comoComprar, ventanasRaw] = data;

  const heroSlides = bannerHeroRaw
    .map((s) => ({
      imagenDesktop: pbFileUrl("banner_hero", s.id, s.imagen_desktop),
      imagenMobile: pbFileUrl("banner_hero", s.id, s.imagen_mobile),
      link: s.link || "",
    }))
    .filter(
      (
        s,
      ): s is {
        imagenDesktop: string;
        imagenMobile: string | null;
        link: string;
      } => Boolean(s.imagenDesktop),
    );

  const mapVentana = (key: "izquierda" | "derecha") => {
    const v = ventanasRaw.find((w) => w.key === key);
    return {
      imagen: v && v.tipo === "imagen" ? pbFileUrl("ventanas_laterales", v.id, v.archivo) : null,
      video: v && v.tipo === "video" ? pbFileUrl("ventanas_laterales", v.id, v.archivo) : null,
      link: v?.link ?? "",
    };
  };

  return (
    <div className="flex flex-1 flex-col bg-white">
      <main className="flex flex-1 flex-col">
        <BannerHeroCarousel slides={heroSlides} />
        <HeroSlider
          categories={categorias}
          ventanaIzquierda={mapVentana("izquierda")}
          ventanaDerecha={mapVentana("derecha")}
        />
        <PromoBanner
          imagenDesktop={pbFileUrl("banners_simples", banner?.id ?? "", banner?.imagen_desktop)}
          imagenMobile={pbFileUrl("banners_simples", banner?.id ?? "", banner?.imagen_mobile)}
          comoComprarDesktop={pbFileUrl(
            "banners_simples",
            comoComprar?.id ?? "",
            comoComprar?.imagen_desktop,
          )}
          comoComprarMobile={pbFileUrl(
            "banners_simples",
            comoComprar?.id ?? "",
            comoComprar?.imagen_mobile,
          )}
          comoComprarLink={comoComprar?.link}
        />
        <ProductGrid products={products} title="Todos los productos" />
      </main>
    </div>
  );
}
