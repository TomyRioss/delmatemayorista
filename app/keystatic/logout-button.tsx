"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";

export function LogOutButton() {
  const router = useRouter();
  const [cargando, setCargando] = useState(false);

  const handleLogout = async () => {
    if (cargando) return;
    setCargando(true);

    try {
      const res = await fetch("/api/admin/logout", { method: "POST" });

      if (res.ok) {
        router.push("/admin/login");
        router.refresh();
      } else {
        console.error("Error al cerrar sesión");
      }
    } catch (err) {
      console.error("Error al cerrar sesión", err);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      <button
        onClick={handleLogout}
        disabled={cargando}
        title="Salir del panel"
        aria-label="Salir del panel"
        className="group flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2.5 text-sm font-bold text-zinc-700 shadow-lg shadow-black/10 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600 hover:shadow-xl hover:shadow-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {cargando ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-0.5 group-hover:scale-110" />
        )}
        {cargando ? "Saliendo..." : "Salir"}
      </button>
    </div>
  );
}