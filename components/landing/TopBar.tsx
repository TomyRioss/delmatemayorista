import { FaBagShopping, FaTruckFast } from "react-icons/fa6";

const items = [
  { icon: FaBagShopping, label: "COMPRA MÍNIMA $50.000" },
  { icon: FaTruckFast, label: "ENVÍOS A TODO EL PAÍS" },
];

// ponytail: keyframes inline en vez de framer-motion. La cinta mide ~5400px y
// animarla desde JS invalida su capa en cada frame, lo que en Android de gama
// media le roba presupuesto de rasterizado al resto de la página (tiles viejos
// al scrollear). En CSS la animación corre en el compositor.
const MARQUEE_CSS = `
@keyframes dm-marquee {
  0%   { transform: translate3d(0, 0, 0); }
  30%  { transform: translate3d(-16.66%, 0, 0); }
  40%  { transform: translate3d(-16.66%, 0, 0); }
  70%  { transform: translate3d(-33.33%, 0, 0); }
  80%  { transform: translate3d(-33.33%, 0, 0); }
  100% { transform: translate3d(-50%, 0, 0); }
}
.dm-marquee {
  animation: dm-marquee 120s ease-in-out infinite;
  will-change: transform;
}
@media (prefers-reduced-motion: reduce) {
  .dm-marquee { animation: none; }
}
`;

export default function TopBar() {
  return (
    <div className="w-full overflow-hidden [contain:paint]">
      <style>{MARQUEE_CSS}</style>
      <div className="dm-marquee flex w-max whitespace-nowrap bg-white py-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <span key={i} className="flex shrink-0 items-center">
            {Array.from({ length: 4 }).map((_, j) =>
              items.map((item, k) => (
                <span
                  key={`${j}-${k}`}
                  className="mx-14 flex items-center gap-3 text-base font-normal text-[#FF3412] sm:text-lg"
                >
                  <item.icon className="h-6 w-6 shrink-0 sm:h-7 sm:w-7" />
                  {item.label}
                </span>
              ))
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
