"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { Minus, Plus, X, ShoppingCart, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCarrito, PEDIDO_MINIMO } from "@/lib/cart-context";

type Paso = "carrito" | "datos" | "confirmado";

function formatearPesos(valor: number): string {
  try {
    return valor.toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    });
  } catch (error) {
    console.error("Error formateando precio", error);
    return `$${valor}`;
  }
}

export default function CartDrawer() {
  const { items, cantidadTotal, totalPedido, actualizarCantidad, quitar, vaciar, abierto, cerrar } =
    useCarrito();

  const [paso, setPaso] = useState<Paso>("carrito");
  const [codigoPedido, setCodigoPedido] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [datos, setDatos] = useState({ nombre: "", apellido: "", email: "", telefono: "" });

  // Reiniciar el flujo cada vez que se abre el drawer desde cero.
  useEffect(() => {
    if (abierto && paso === "confirmado") {
      // no reiniciar mientras se está mostrando la confirmación
      return;
    }
  }, [abierto, paso]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      cerrar();
      if (paso === "confirmado") {
        vaciar();
      }
      setPaso("carrito");
      setError(null);
      setCodigoPedido(null);
    }
  };

  const alcanzoMinimo = totalPedido >= PEDIDO_MINIMO;
  const progreso = Math.min(100, Math.round((totalPedido / PEDIDO_MINIMO) * 100));

  const confirmarPedido = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setEnviando(true);

    try {
      const res = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comprador: datos,
          items: items.map((item) => ({
            nombre: item.nombre,
            cantidad: item.cantidad,
            precio: item.precio,
          })),
          total: totalPedido,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.error ?? "No pudimos confirmar tu pedido. Intentá nuevamente.");
        return;
      }

      setCodigoPedido(data.codigo ?? null);
      setPaso("confirmado");
    } catch (err) {
      console.error("Error confirmando el pedido", err);
      setError("No pudimos conectar con el servidor. Intentá nuevamente.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <DialogPrimitive.Root open={abierto} onOpenChange={handleOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/40 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <DialogPrimitive.Popup
          className={cn(
            "fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-xl outline-none",
            "data-open:animate-in data-open:slide-in-from-right data-closed:animate-out data-closed:slide-out-to-right"
          )}
        >
          <header className="flex items-center justify-between border-b border-black/10 px-5 py-4">
            <DialogPrimitive.Title className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-black">
              <ShoppingCart className="h-5 w-5 text-[#FF3412]" />
              {paso === "carrito" && "Tu carrito"}
              {paso === "datos" && "Tus datos"}
              {paso === "confirmado" && "Pedido confirmado"}
            </DialogPrimitive.Title>
            <DialogPrimitive.Close
              aria-label="Cerrar carrito"
              className="flex h-8 w-8 items-center justify-center rounded-full text-black hover:bg-black/5"
            >
              <X className="h-5 w-5" />
            </DialogPrimitive.Close>
          </header>

          {paso === "carrito" && (
            <PasoCarrito
              items={items}
              cantidadTotal={cantidadTotal}
              totalPedido={totalPedido}
              alcanzoMinimo={alcanzoMinimo}
              progreso={progreso}
              actualizarCantidad={actualizarCantidad}
              quitar={quitar}
              onContinuar={() => setPaso("datos")}
            />
          )}

          {paso === "datos" && (
            <PasoDatos
              datos={datos}
              setDatos={setDatos}
              totalPedido={totalPedido}
              error={error}
              enviando={enviando}
              onVolver={() => setPaso("carrito")}
              onSubmit={confirmarPedido}
            />
          )}

          {paso === "confirmado" && (
            <PasoConfirmado codigoPedido={codigoPedido} onCerrar={() => handleOpenChange(false)} />
          )}
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

type PasoCarritoProps = {
  items: ReturnType<typeof useCarrito>["items"];
  cantidadTotal: number;
  totalPedido: number;
  alcanzoMinimo: boolean;
  progreso: number;
  actualizarCantidad: (slug: string, cantidad: number) => void;
  quitar: (slug: string) => void;
  onContinuar: () => void;
};

function PasoCarrito({
  items,
  cantidadTotal,
  totalPedido,
  alcanzoMinimo,
  progreso,
  actualizarCantidad,
  quitar,
  onContinuar,
}: PasoCarritoProps) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {items.length === 0 ? (
          <p className="mt-10 text-center text-sm text-black/50">Tu carrito está vacío.</p>
        ) : (
          <ul className="flex flex-col gap-4">
            {items.map((item) => (
              <li key={item.slug} className="flex gap-3 border-b border-black/5 pb-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-sm bg-zinc-50">
                  {item.imagen && (
                    <Image src={item.imagen} alt={item.nombre} fill className="object-cover" sizes="64px" />
                  )}
                </div>

                <div className="flex flex-1 flex-col gap-1">
                  <p className="text-sm font-semibold text-black">{item.nombre}</p>
                  <p className="text-sm font-bold text-[#FF3412]">{item.precioFormateado}</p>

                  <div className="mt-1 flex items-center gap-2">
                    <button
                      type="button"
                      aria-label="Restar cantidad"
                      onClick={() => actualizarCantidad(item.slug, item.cantidad - 1)}
                      className="flex h-6 w-6 items-center justify-center rounded-full border border-black/15 text-black hover:bg-black/5"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold text-black">{item.cantidad}</span>
                    <button
                      type="button"
                      aria-label="Sumar cantidad"
                      onClick={() => actualizarCantidad(item.slug, item.cantidad + 1)}
                      className="flex h-6 w-6 items-center justify-center rounded-full border border-black/15 text-black hover:bg-black/5"
                    >
                      <Plus className="h-3 w-3" />
                    </button>

                    <span className="ml-2 text-[10px] font-semibold uppercase text-black/40">
                      Mín. {item.cantidadMinima}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  aria-label="Quitar del carrito"
                  onClick={() => quitar(item.slug)}
                  className="self-start text-black/40 hover:text-[#FF3412]"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border-t border-black/10 px-5 py-4">
        <div className="mb-3">
          <div className="mb-1 flex items-center justify-between text-xs font-semibold uppercase text-black/60">
            <span>Pedido mínimo</span>
            <span>{alcanzoMinimo ? "¡Listo!" : `${progreso}%`}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-black/10">
            <div
              className={cn("h-full rounded-full transition-all", alcanzoMinimo ? "bg-[#F4C845]" : "bg-[#FF3412]")}
              style={{ width: `${progreso}%` }}
            />
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between text-sm font-bold text-black">
          <span>Total ({cantidadTotal} ítems)</span>
          <span>{formatearPesos(totalPedido)}</span>
        </div>

        <button
          type="button"
          disabled={items.length === 0 || !alcanzoMinimo}
          onClick={onContinuar}
          className="w-full rounded-sm bg-[#FF3412] px-4 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
        >
          {alcanzoMinimo ? "Continuar" : `Faltan ${formatearPesos(Math.max(0, PEDIDO_MINIMO - totalPedido))}`}
        </button>
      </div>
    </div>
  );
}

type PasoDatosProps = {
  datos: { nombre: string; apellido: string; email: string; telefono: string };
  setDatos: (datos: { nombre: string; apellido: string; email: string; telefono: string }) => void;
  totalPedido: number;
  error: string | null;
  enviando: boolean;
  onVolver: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

function PasoDatos({ datos, setDatos, totalPedido, error, enviando, onVolver, onSubmit }: PasoDatosProps) {
  return (
    <form onSubmit={onSubmit} className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <p className="mb-4 text-sm text-black/60">
          Dejanos tus datos para confirmar el pedido por {formatearPesos(totalPedido)}.
        </p>

        <div className="flex flex-col gap-3">
          {(
            [
              { key: "nombre", label: "Nombre", type: "text" },
              { key: "apellido", label: "Apellido", type: "text" },
              { key: "email", label: "Email", type: "email" },
              { key: "telefono", label: "Teléfono", type: "tel" },
            ] as const
          ).map((campo) => (
            <div key={campo.key} className="flex flex-col gap-1.5">
              <label htmlFor={campo.key} className="text-xs font-bold uppercase tracking-wide text-black">
                {campo.label}
              </label>
              <input
                id={campo.key}
                type={campo.type}
                required
                value={datos[campo.key]}
                onChange={(e) => setDatos({ ...datos, [campo.key]: e.target.value })}
                className="rounded-sm border border-black/15 bg-white px-4 py-3 text-sm text-black outline-none focus:border-[#FF3412]"
              />
            </div>
          ))}
        </div>

        {error && (
          <p role="alert" className="mt-4 rounded-sm bg-black/5 px-3 py-2 text-sm font-semibold text-[#FF3412]">
            {error}
          </p>
        )}
      </div>

      <div className="flex gap-3 border-t border-black/10 px-5 py-4">
        <button
          type="button"
          onClick={onVolver}
          className="flex-1 rounded-sm border border-black/15 px-4 py-3 text-sm font-bold uppercase tracking-wide text-black hover:bg-black/5"
        >
          Volver
        </button>
        <button
          type="submit"
          disabled={enviando}
          className="flex-1 rounded-sm bg-[#FF3412] px-4 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
        >
          {enviando ? "Confirmando..." : "Confirmar pedido"}
        </button>
      </div>
    </form>
  );
}

function PasoConfirmado({ codigoPedido, onCerrar }: { codigoPedido: string | null; onCerrar: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F4C845]">
        <ShoppingCart className="h-8 w-8 text-black" />
      </div>
      <h3 className="text-lg font-black uppercase text-black">¡Pedido confirmado!</h3>
      <p className="text-sm text-black/60">
        Te vamos a contactar a la brevedad para coordinar el pago y el envío.
      </p>
      {codigoPedido && (
        <p className="rounded-sm bg-black/5 px-4 py-2 text-sm font-bold uppercase tracking-wide text-black">
          Código de seguimiento: <span className="text-[#FF3412]">{codigoPedido}</span>
        </p>
      )}
      <button
        type="button"
        onClick={onCerrar}
        className="mt-2 rounded-sm bg-[#FF3412] px-6 py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-black"
      >
        Cerrar
      </button>
    </div>
  );
}
