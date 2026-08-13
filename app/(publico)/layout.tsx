import TopBar from "@/components/landing/TopBar";
import Navbar from "@/components/landing/Navbar";
import WhatsappButton from "@/components/landing/WhatsappButton";
import Footer from "@/components/landing/Footer";
import CartDrawer from "@/components/landing/CartDrawer";
import { CartProvider } from "@/lib/cart-context";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <TopBar />
      <Navbar />
      {children}
      <Footer />
      <WhatsappButton />
      <CartDrawer />
    </CartProvider>
  );
}
