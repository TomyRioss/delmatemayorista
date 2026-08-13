"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Minus, Plus, Trash2, X as XIcon } from "lucide-react";
import { Dialog } from "@base-ui/react/dialog";
import { useCart, MIN_ORDER_TOTAL } from "@/lib/cart-context";
import { cn } from "@/lib/utils";

type View = "cart" | "checkout" | "success";

export default function CartDrawer() {
  const { items, updateQty, removeItem, clear, totalCount, totalPrice, isOpen, closeCart } =
    useCart();
  const [view, setView] = useState<View>("cart");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const invalidItems = items.filter((i) => i.quantity < (i.minQty ?? 1));
  const hasInvalidItems = invalidItems.length > 0;
  const belowMinOrder = items.length > 0 && totalPrice < MIN_ORDER_TOTAL;
  const checkoutDisabled = hasInvalidItems || belowMinOrder;
  const errorRef = useRef<HTMLParagraphElement>(null);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closeCart();
      setView("cart");
      setFormError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    if (hasInvalidItems) {
      setFormError(
        `Ajustá la cantidad de ${invalidItems.map((i) => i.name).join(", ")} para cumplir el mínimo de compra.`
      );
      return;
    }

    if (belowMinOrder) {
      setFormError(
        `El pedido mínimo es de $${MIN_ORDER_TOTAL.toLocaleString("es-AR")}. Agregá más productos para continuar.`
      );
      return;
    }

    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    const payload = {
      nombre: String(form.get("nombre") || "").trim(),
      apellido: String(form.get("apellido") || "").trim(),
      email: String(form.get("email") || "").trim(),
      telefono: String(form.get("telefono") || "").trim(),
      items: items.map((i) => ({
        producto: i.name,
        cantidad: i.quantity,
        precioUnitario: i.priceValue,
      })),
      total: totalPrice,
    };

    try {
      const res = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "No se pudo crear el pedido.");
      }
      clear();
      setView("success");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Error inesperado.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (formError) errorRef.current?.focus();
  }, [formError]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/40 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <Dialog.Popup
          className={cn(
            "fixed top-0 right-0 z-50 flex h-full w-full max-w-sm flex-col bg-white shadow-2xl outline-none",
            "data-open:animate-in data-open:slide-in-from-right data-closed:animate-out data-closed:slide-out-to-right"
          )}
        >
          <div className="flex items-center justify-between border-b border-black/10 px-4 py-4">
            <Dialog.Title className="text-lg font-black uppercase tracking-wide text-black">
              {view === "checkout" ? "Tus datos" : view === "success" ? "Pedido enviado" : "Mi carrito"}
            </Dialog.Title>
            <Dialog.Close
              aria-label="Cerrar"
              className="flex h-8 w-8 items-center justify-center rounded-full text-black hover:bg-black/5"
            >
              <XIcon className="h-5 w-5" />
            </Dialog.Close>
          </div>

          {view === "cart" && (
            <>
              <div className="flex-1 overflow-y-auto px-4 py-4">
                {items.length === 0 ? (
                  <p className="text-sm text-black/60">Todavía no agregaste productos.</p>
                ) : (
                  <ul className="flex flex-col gap-4">
                    {items.map((item) => (
                      <li key={item.slug} className="flex gap-3">
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-sm bg-zinc-50">
                          {item.image && (
                            <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                          )}
                        </div>
                        <div className="flex flex-1 flex-col gap-1">
                          <p className="line-clamp-2 text-sm font-semibold text-black">{item.name}</p>
                          <p className="text-sm font-bold text-[#FF3412]">
                            ${item.priceValue.toLocaleString("es-AR")}
                          </p>
                          {item.quantity <= item.minQty && item.minQty > 1 && (
                            <p className="text-[11px] font-semibold text-black/50">
                              Mínimo {item.minQty} unidades
                            </p>
                          )}
                          <div className="mt-1 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => updateQty(item.slug, item.quantity - 1)}
                              disabled={item.quantity <= item.minQty}
                              aria-label="Restar"
                              className="flex h-11 w-11 items-center justify-center rounded-full border border-black/20 text-black hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQty(item.slug, item.quantity + 1)}
                              aria-label="Sumar"
                              className="flex h-11 w-11 items-center justify-center rounded-full border border-black/20 text-black hover:bg-black/5"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeItem(item.slug)}
                              aria-label="Quitar"
                              className="ml-auto flex h-11 w-11 items-center justify-center text-black/40 hover:text-[#FF3412]"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {items.length > 0 && (
                <div className="border-t border-black/10 px-4 py-4">
                  {hasInvalidItems && (
                    <p role="alert" className="mb-3 text-xs font-semibold text-[#FF3412]">
                      Ajustá la cantidad de {invalidItems.map((i) => i.name).join(", ")} para cumplir el mínimo de compra.
                    </p>
                  )}
                  {!hasInvalidItems && belowMinOrder && (
                    <p role="alert" className="mb-3 text-xs font-semibold text-[#FF3412]">
                      Pedido mínimo: ${MIN_ORDER_TOTAL.toLocaleString("es-AR")}. Te faltan $
                      {(MIN_ORDER_TOTAL - totalPrice).toLocaleString("es-AR")}.
                    </p>
                  )}
                  <div className="mb-3 flex items-center justify-between text-sm font-bold text-black">
                    <span>Total ({totalCount} {totalCount === 1 ? "unidad" : "unidades"})</span>
                    <span className="text-[#FF3412]">${totalPrice.toLocaleString("es-AR")}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setView("checkout")}
                    disabled={checkoutDisabled}
                    className="w-full rounded-sm bg-[#FF3412] px-4 py-3 text-sm font-bold uppercase text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#FF3412]"
                  >
                    Finalizar pedido
                  </button>
                </div>
              )}
            </>
          )}

          {view === "checkout" && (
            <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-y-auto px-4 py-4">
              <div className="flex flex-1 flex-col gap-3">
                <label className="flex flex-col gap-1 text-sm font-semibold text-black">
                  Nombre
                  <input
                    name="nombre"
                    required
                    className="rounded-sm border border-black/20 px-3 py-2 text-sm focus:border-[#FF3412] focus:outline-none"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm font-semibold text-black">
                  Apellido
                  <input
                    name="apellido"
                    required
                    className="rounded-sm border border-black/20 px-3 py-2 text-sm focus:border-[#FF3412] focus:outline-none"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm font-semibold text-black">
                  Email
                  <input
                    type="email"
                    name="email"
                    placeholder="admin@delmatemayorista.com"
                    required
                    className="rounded-sm border border-black/20 px-3 py-2 text-sm focus:border-[#FF3412] focus:outline-none"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm font-semibold text-black">
                  Teléfono
                  <input
                    type="tel"
                    name="telefono"
                    required
                    className="rounded-sm border border-black/20 px-3 py-2 text-sm focus:border-[#FF3412] focus:outline-none"
                  />
                </label>

                {formError && (
                  <p ref={errorRef} role="alert" tabIndex={-1} className="text-sm font-semibold text-[#FF3412] outline-none">
                    {formError}
                  </p>
                )}
              </div>

              <div className="mt-4 flex flex-col gap-2 border-t border-black/10 pt-4">
                <div className="flex items-center justify-between text-sm font-bold text-black">
                  <span>Total</span>
                  <span className="text-[#FF3412]">${totalPrice.toLocaleString("es-AR")}</span>
                </div>
                <button
                  type="submit"
                  disabled={submitting || checkoutDisabled}
                  className="w-full rounded-sm bg-[#FF3412] px-4 py-3 text-sm font-bold uppercase text-white transition-colors hover:bg-black disabled:opacity-60"
                >
                  {submitting ? "Enviando..." : "Confirmar pedido"}
                </button>
                <button
                  type="button"
                  onClick={() => setView("cart")}
                  className="w-full rounded-sm border-2 border-black px-4 py-3 text-sm font-bold uppercase text-black transition-colors hover:bg-black/5"
                >
                  Volver al carrito
                </button>
              </div>
            </form>
          )}

          {view === "success" && (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-4 text-center">
              <p className="text-lg font-black uppercase text-black">¡Pedido recibido!</p>
              <p className="text-sm text-black/60">
                Te vamos a contactar a la brevedad para coordinar el pago y el envío.
              </p>
              <Dialog.Close className="mt-2 rounded-sm bg-[#FF3412] px-4 py-3 text-sm font-bold uppercase text-white hover:bg-black">
                Cerrar
              </Dialog.Close>
            </div>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
