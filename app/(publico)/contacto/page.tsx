import Link from "next/link";
import { FaInstagram, FaFacebook, FaTiktok, FaWhatsapp, FaEnvelope, FaTruckFast } from "react-icons/fa6";
import { Clock } from "lucide-react";

const socialLinks = [
  { icon: FaInstagram, label: "@delmatemayorista", href: "https://instagram.com/delmatemayorista", iconClass: "text-[#E1306C]" },
  { icon: FaFacebook, label: "@Delmate Mayorista", href: "https://facebook.com/DelmateMayorista", iconClass: "text-[#1877F2]" },
  { icon: FaTiktok, label: "@delmate_oficial", href: "https://www.tiktok.com/@delmate_oficial", iconClass: "text-black" },
];

export default function ContactoPage() {
  return (
    <div className="flex flex-1 flex-col bg-white">
      <section className="bg-[#FF3412]">
        <div className="mx-auto max-w-[1500px] px-4 py-14 sm:px-6 sm:py-20">
          <h1 className="max-w-2xl text-3xl font-black uppercase leading-tight tracking-wide text-white sm:text-5xl">
            Contacto
          </h1>
          <p className="mt-4 max-w-xl text-sm font-semibold text-white/90 sm:text-base">
            Consultas, pedidos y stock: hablanos directo por WhatsApp o elegí el canal que prefieras.
          </p>
        </div>
      </section>

      <main className="mx-auto w-full max-w-[1500px] px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div className="flex flex-col gap-4">
            <Link
              href="https://wa.me/5491165358444"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-2xl bg-[#FF3412] px-6 py-6 transition-opacity hover:opacity-90 sm:px-8"
            >
              <FaWhatsapp className="h-12 w-12 shrink-0 rounded-full bg-white p-2 text-[#25D366]" />
              <div>
                <p className="text-lg font-black uppercase text-white sm:text-2xl">Escribinos por WhatsApp</p>
                <p className="text-sm font-semibold text-white/90 sm:text-base">(011) 1565358444</p>
              </div>
            </Link>

            <a
              href="mailto:bazarmayoristadelmate@gmail.com"
              className="flex items-center gap-4 rounded-2xl border border-black/10 px-6 py-5 hover:bg-zinc-50 sm:px-8"
            >
              <FaEnvelope className="h-9 w-9 shrink-0 text-[#FF3412]" />
              <div>
                <p className="text-sm font-black uppercase text-black">Email</p>
                <p className="text-sm text-black/70 sm:text-base">bazarmayoristadelmate@gmail.com</p>
              </div>
            </a>

            <div className="flex items-center gap-4 rounded-2xl border border-black/10 px-6 py-5 sm:px-8">
              <Clock className="h-9 w-9 shrink-0 text-[#FF3412]" strokeWidth={2} />
              <div>
                <p className="text-sm font-black uppercase text-black">Horario de atención</p>
                <p className="text-sm text-black/70 sm:text-base">Lunes a viernes, 9 a 18 hs</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-black/10 px-6 py-5 sm:px-8">
              <FaTruckFast className="h-9 w-9 shrink-0 text-[#FF3412]" />
              <div>
                <p className="text-sm font-black uppercase text-black">Envíos</p>
                <p className="text-sm text-black/70 sm:text-base">A todo el país. Compra mínima $50.000.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-black uppercase text-black sm:text-2xl">Seguinos en redes</h2>
            <div className="flex flex-col divide-y divide-black/10 rounded-2xl border border-black/10">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-6 py-4 hover:bg-zinc-50"
                >
                  <social.icon className={`h-9 w-9 shrink-0 rounded-full bg-zinc-100 p-1.5 ${social.iconClass}`} />
                  <span className="text-sm font-medium text-black sm:text-base">{social.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
