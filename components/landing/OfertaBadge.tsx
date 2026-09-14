type OfertaBadgeProps = {
  size?: "sm" | "lg";
};

export default function OfertaBadge({ size = "sm" }: OfertaBadgeProps) {
  const outer =
    size === "lg" ? "h-28 w-28 sm:h-32 sm:w-32" : "h-20 w-20 sm:h-24 sm:w-24";
  const ofertaText = size === "lg" ? "text-xl sm:text-2xl" : "text-sm sm:text-base";

  return (
    <span
      role="img"
      aria-label="Oferta"
      className={`${outer} pointer-events-none flex -rotate-12 items-center justify-center rounded-full border-2 border-black bg-[#FF3412] text-center text-white shadow-[2px_2px_0_0_#000]`}
    >
      <span className="flex h-[86%] w-[86%] items-center justify-center rounded-full border border-dashed border-white/90 leading-none">
        <span className={`${ofertaText} font-black tracking-tight`}>OFERTA!!</span>
      </span>
    </span>
  );
}
