type ProductCardProps = {
  name: string;
  price: string;
  badge?: string;
};

export default function ProductCard({ name, price, badge }: ProductCardProps) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-black/10 bg-white transition-shadow hover:shadow-lg">
      {badge && (
        <span className="absolute left-3 top-3 rounded-full bg-[#FF3412] px-3 py-1 text-xs font-bold text-white">
          {badge}
        </span>
      )}
      <div className="flex aspect-square items-center justify-center bg-zinc-50">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="h-16 w-16 text-black/20"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 7.5 12 3l9 4.5M3 7.5v9L12 21m-9-4.5L12 12m0 9 9-4.5v-9M12 12l9-4.5M12 12v9"
          />
        </svg>
      </div>
      <div className="flex flex-col gap-1 p-4">
        <h3 className="text-sm font-semibold text-black">{name}</h3>
        <p className="text-base font-bold text-[#FF3412]">{price}</p>
      </div>
    </div>
  );
}
