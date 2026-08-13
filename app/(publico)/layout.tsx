import TopBar from "@/components/landing/TopBar";
import Navbar from "@/components/landing/Navbar";
import CartDrawer from "@/components/landing/CartDrawer";
import WhatsappButton from "@/components/landing/WhatsappButton";
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
      <CartDrawer />
      <WhatsappButton />
    </CartProvider>
  );
}