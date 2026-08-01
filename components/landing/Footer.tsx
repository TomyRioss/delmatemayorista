export default function Footer() {
  return (
    <footer className="border-t-2 border-[#FF3412] bg-white">
      <div className="mx-auto flex max-w-[1500px] flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-black/60 sm:flex-row sm:px-6">
        <span className="text-base font-extrabold text-black">
          DEL<span className="text-[#FF3412]">MATE</span>
        </span>
        <p>© {new Date().getFullYear()} Del Mate Mayorista. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
