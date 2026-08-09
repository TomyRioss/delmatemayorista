import TopBar from "@/components/landing/TopBar";
import Navbar from "@/components/landing/Navbar";
import WhatsappButton from "@/components/landing/WhatsappButton";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopBar />
      <Navbar />
      {children}
      <WhatsappButton />
    </>
  );
}