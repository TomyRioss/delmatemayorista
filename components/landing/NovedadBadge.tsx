type NovedadBadgeProps = {
  size?: "sm" | "lg";
};

export default function NovedadBadge({ size = "sm" }: NovedadBadgeProps) {
  const outer =
    size === "lg" ? "h-28 w-28 sm:h-32 sm:w-32" : "h-20 w-20 sm:h-24 sm:w-24";
  const text = size === "lg" ? "text-lg sm:text-xl" : "text-xs sm:text-sm";

  return (
    <span
      role="img"
      aria-label="Novedad"
      className={`${outer} pointer-events-none flex -rotate-12 items-center justify-center rounded-full border-2 border-black bg-[#F4C845] text-center text-black shadow-[2px_2px_0_0_#000]`}
    >
      <span className="flex h-[86%] w-[86%] items-center justify-center rounded-full border border-dashed border-white/90 leading-none">
        <span className={`${text} font-black tracking-tight`}>NOVEDAD!</span>
      </span>
    </span>
  );
}
