export default function TopBar() {
  const message = "Mínimo de compra para envío al interior $ 80.000";

  return (
    <div className="w-full overflow-hidden bg-white">
      <div className="marquee-track flex w-max whitespace-nowrap py-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <span key={i} className="flex shrink-0 items-center">
            {Array.from({ length: 4 }).map((_, j) => (
              <span
                key={j}
                className="mx-6 text-xs font-semibold text-[#FF3412] sm:text-sm"
              >
                {message}
              </span>
            ))}
          </span>
        ))}
      </div>

      <style>{`
        .marquee-track {
          animation: marquee-scroll 20s linear infinite;
        }
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
