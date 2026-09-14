type OfertaBadgeProps = {
  size?: "sm" | "lg";
};

export default function OfertaBadge({ size = "sm" }: OfertaBadgeProps) {
  const outer =
    size === "lg" ? "h-20 w-20 sm:h-24 sm:w-24" : "h-14 w-14 sm:h-16 sm:w-16";
  const superText = size === "lg" ? "text-[11px] sm:text-xs" : "text-[8px] sm:text-[9px]";
  const ofertaText = size === "lg" ? "text-base sm:text-lg" : "text-xs sm:text-[13px]";

  return (
    <span
      role="img"
      aria-label="Super oferta"
      className={`${outer} pointer-events-none flex -rotate-12 items-center justify-center rounded-full border-2 border-black bg-[#FF3412] text-center text-white shadow-[2px_2px_0_0_#000]`}
    >
      <span className="flex h-[86%] w-[86%] flex-col items-center justify-center rounded-full border border-dashed border-white/90 leading-none">
        <span className={`${superText} font-extrabold tracking-[0.18em]`}>SUPER</span>
        <span className={`${ofertaText} font-black tracking-tight`}>OFERTA</span>
      </span>
    </span>
  );
}
