import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaFacebook, FaTiktok, FaWhatsapp, FaEnvelope, FaTruckFast } from "react-icons/fa6";

const socialLinks = [
  { icon: FaInstagram, label: "@delmatemayorista", href: "https://instagram.com/delmatemayorista", iconClass: "text-[#E1306C]" },
  { icon: FaFacebook, label: "@Delmate Mayorista", href: "https://facebook.com/DelmateMayorista", iconClass: "text-[#1877F2]" },
  { icon: FaTiktok, label: "@delmate_mayorista", href: "https://www.tiktok.com/@delmate_mayorista", iconClass: "text-black" },
];

export default function Footer() {
  return (
    <footer className="w-full bg-[#FF3412]">
      <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-10 px-6 py-10 sm:px-10">
        <Link href="/" className="flex shrink-0 flex-col items-center justify-center">
          <span className="font-[family-name:var(--font-wood-type)] text-lg font-black uppercase tracking-widest text-black sm:text-2xl">
            Mayorista
          </span>
          <div className="-mt-2 flex h-24 w-24 items-center justify-center sm:-mt-3 sm:h-32 sm:w-32">
            <Image
              src="/logo.png"
              alt="Del Mate"
              width={128}
              height={128}
              className="h-full w-full object-contain"
            />
          </div>
        </Link>

        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-bold uppercase text-white sm:text-2xl">
            Visitá nuestras redes sociales
          </h3>
          <div className="flex flex-col gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-white transition-opacity hover:opacity-80"
              >
                <social.icon className={`h-10 w-10 shrink-0 rounded-full bg-white p-1.5 ${social.iconClass}`} />
                <span className="text-base font-medium sm:text-lg">{social.label}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6 text-white">
          <div className="flex items-center gap-3">
            <FaTruckFast className="h-8 w-8 shrink-0" />
            <p className="text-sm font-medium uppercase sm:text-base">
              Envíos a
              <br />
              todo el país
            </p>
          </div>

          <a href="mailto:bazarmayoristadelmate@gmail.com" className="flex items-center gap-3 hover:opacity-80">
            <FaEnvelope className="h-8 w-8 shrink-0" />
            <span className="text-sm font-medium sm:text-base">bazarmayoristadelmate@gmail.com</span>
          </a>

          <a href="https://wa.me/5491165358444" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:opacity-80">
            <FaWhatsapp className="h-12 w-12 shrink-0 rounded-full bg-white p-1.5 text-[#25D366]" />
            <span className="text-sm font-medium sm:text-base">(011) 1565358444</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
