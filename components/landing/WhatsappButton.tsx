import { WhatsAppIcon } from "@/components/icons";


const WHATSAPP_NUMBER = "5491165358444";

export default function WhatsAppFloatingButton() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Comunicate con nosotros por WhatsApp"
      className="group fixed bottom-5 right-5 z-50 flex flex-row-reverse items-center justify-center gap-2 rounded-full bg-[#25D366] py-2 pl-4 pr-3 text-white shadow-lg transition-all sm:bottom-6 sm:right-6 sm:flex-row sm:py-3 sm:pl-3 sm:pr-5"
    >
      <WhatsAppIcon className="h-7 w-7 shrink-0" />
      <span className="whitespace-nowrap text-xs font-bold sm:text-sm">
        Comunicate con nosotros
      </span>
    </a>
  );
}
