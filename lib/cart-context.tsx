"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export const PEDIDO_MINIMO = 50000;

const STORAGE_KEY = "delmate-carrito";

export type ItemCarrito = {
  slug: string;
  nombre: string;
  precio: number;
  precioFormateado: string;
  imagen: string;
  cantidadMinima: number;
  cantidad: number;
};

type ItemParaAgregar = Omit<ItemCarrito, "cantidad">;

type CartContextValue = {
  items: ItemCarrito[];
  cantidadTotal: number;
  totalPedido: number;
  agregar: (item: ItemParaAgregar) => void;
  actualizarCantidad: (slug: string, cantidad: number) => void;
  quitar: (slug: string) => void;
  vaciar: () => void;
  abierto: boolean;
  abrir: () => void;
  cerrar: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function leerCarritoGuardado(): ItemCarrito[] {
  if (typeof window === "undefined") return [];

  try {
    const guardado = window.localStorage.getItem(STORAGE_KEY);
    if (!guardado) return [];

    const parseado = JSON.parse(guardado);
    if (!Array.isArray(parseado)) return [];

    return parseado.filter(
      (item): item is ItemCarrito =>
        item &&
        typeof item.slug === "string" &&
        typeof item.nombre === "string" &&
        typeof item.precio === "number" &&
        typeof item.cantidad === "number"
    );
  } catch (error) {
    console.error("El carrito guardado está corrupto, se reinicia.", error);
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ItemCarrito[]>([]);
  const [abierto, setAbierto] = useState(false);
  const [hidratado, setHidratado] = useState(false);

  // Hidratar desde localStorage solo en cliente, una vez montado.
  // (No se puede leer localStorage durante el render del server, así que
  // esta sincronización inicial en efecto es intencional.)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(leerCarritoGuardado());
    setHidratado(true);
  }, []);

  // Sincronizar en cada cambio, una vez hidratado (para no pisar el
  // storage con [] antes de leerlo).
  useEffect(() => {
    if (!hidratado) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("No se pudo guardar el carrito en localStorage.", error);
    }
  }, [items, hidratado]);

  const agregar = useCallback((item: ItemParaAgregar) => {
    setItems((prev) => {
      const existente = prev.find((i) => i.slug === item.slug);
      if (existente) {
        return prev.map((i) =>
          i.slug === item.slug ? { ...i, cantidad: i.cantidad + item.cantidadMinima } : i
        );
      }
      return [...prev, { ...item, cantidad: Math.max(1, item.cantidadMinima) }];
    });
    setAbierto(true);
  }, []);

  const actualizarCantidad = useCallback((slug: string, cantidad: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.slug !== slug) return item;
        const minimo = Math.max(1, item.cantidadMinima);
        return { ...item, cantidad: Math.max(minimo, cantidad) };
      })
    );
  }, []);

  const quitar = useCallback((slug: string) => {
    setItems((prev) => prev.filter((item) => item.slug !== slug));
  }, []);

  const vaciar = useCallback(() => {
    setItems([]);
  }, []);

  const abrir = useCallback(() => setAbierto(true), []);
  const cerrar = useCallback(() => setAbierto(false), []);

  const cantidadTotal = useMemo(
    () => items.reduce((acc, item) => acc + item.cantidad, 0),
    [items]
  );

  const totalPedido = useMemo(
    () => items.reduce((acc, item) => acc + item.cantidad * item.precio, 0),
    [items]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      cantidadTotal,
      totalPedido,
      agregar,
      actualizarCantidad,
      quitar,
      vaciar,
      abierto,
      abrir,
      cerrar,
    }),
    [items, cantidadTotal, totalPedido, agregar, actualizarCantidad, quitar, vaciar, abierto, abrir, cerrar]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCarrito(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCarrito debe usarse dentro de un CartProvider");
  }
  return context;
}
