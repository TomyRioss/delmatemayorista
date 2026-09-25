import Link from "next/link";
import { ArrowLeft, BarChart3 } from "lucide-react";
import { getVisits } from "@/lib/vercel-analytics";

export const dynamic = "force-dynamic";

const number = new Intl.NumberFormat("es-AR");
const date = new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "2-digit" });

export default async function VisitsPage() {
  let rows: Awaited<ReturnType<typeof getVisits>> = [];
  let error = "";

  try {
    rows = await getVisits();
  } catch (cause) {
    error = cause instanceof Error ? cause.message : "No se pudieron cargar las visitas.";
  }

  const pageviews = rows.reduce((total, row) => total + row.pageviews, 0);
  const visitors = rows.reduce((total, row) => total + row.visitors, 0);

  return (
    <main className="min-h-screen bg-[#f7f5f2] px-5 py-8 text-black sm:px-10">
      <div className="mx-auto max-w-5xl">
        <Link href="/keystatic" className="mb-10 inline-flex items-center gap-2 text-sm font-bold hover:underline">
          <ArrowLeft className="h-4 w-4" /> Volver al admin
        </Link>

        <div className="mb-8 flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-[#FF3412]" />
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-black/50">Últimos 30 días</p>
            <h1 className="text-3xl font-black uppercase">Visitas</h1>
          </div>
        </div>

        {error ? (
          <div className="rounded-sm border-2 border-[#FF3412] bg-white p-5 text-sm font-bold text-[#FF3412]">{error}</div>
        ) : (
          <>
            <div className="mb-8 grid gap-4 sm:grid-cols-2">
              <Metric label="Visitas" value={pageviews} />
              <Metric label="Visitantes" value={visitors} />
            </div>
            <div className="overflow-hidden rounded-sm border-2 border-black/10 bg-white">
              <div className="grid grid-cols-3 border-b-2 border-black/10 px-5 py-3 text-xs font-bold uppercase tracking-wide text-black/50">
                <span>Día</span><span className="text-right">Visitas</span><span className="text-right">Visitantes</span>
              </div>
              {rows.length === 0 ? <p className="p-5 text-sm text-black/60">Todavía no hay datos.</p> : rows.map((row) => (
                <div key={row.timestamp} className="grid grid-cols-3 border-b border-black/5 px-5 py-3 text-sm last:border-0">
                  <span>{date.format(new Date(row.timestamp))}</span>
                  <span className="text-right font-bold">{number.format(row.pageviews)}</span>
                  <span className="text-right font-bold">{number.format(row.visitors)}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return <div className="rounded-sm border-2 border-black/10 bg-white p-5"><p className="text-xs font-bold uppercase tracking-wide text-black/50">{label}</p><p className="mt-2 text-4xl font-black">{number.format(value)}</p></div>;
}
