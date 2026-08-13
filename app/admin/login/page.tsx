"use client";

import { Suspense, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, Mail, Lock, ArrowLeft, Loader2, LogIn } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/keystatic";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setCargando(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.error ?? "Email o contraseña incorrectos.");
        return;
      }

      router.push(next);
      router.refresh();
    } catch (err) {
      console.error("Error iniciando sesión de administrador", err);
      setError("No pudimos conectar con el servidor. Intentá nuevamente.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-zinc-500">
          Email
        </label>
        <div className="group relative">
          <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-[#FF3412]" />
          <input
            id="email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-3.5 pl-11 pr-4 text-sm text-zinc-900 shadow-sm outline-none transition-all placeholder:text-zinc-400 hover:bg-white hover:shadow focus:border-[#FF3412] focus:bg-white focus:shadow-md focus:ring-4 focus:ring-[#FF3412]/10"
            placeholder="admin@delmatemayorista.com"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-zinc-500">
          Contraseña
        </label>
        <div className="group relative">
          <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-[#FF3412]" />
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-3.5 pl-11 pr-4 text-sm text-zinc-900 shadow-sm outline-none transition-all placeholder:text-zinc-400 hover:bg-white hover:shadow focus:border-[#FF3412] focus:bg-white focus:shadow-md focus:ring-4 focus:ring-[#FF3412]/10"
            placeholder="••••••••"
          />
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600"
        >
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={cargando}
        className="group mt-1 flex items-center justify-center gap-2 rounded-xl bg-[#FF3412] px-6 py-3.5 text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-[#FF3412]/25 transition-all hover:bg-black hover:shadow-xl hover:shadow-black/20 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-[#FF3412] disabled:hover:shadow-lg disabled:hover:shadow-[#FF3412]/25"
      >
        {cargando ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Ingresando...
          </>
        ) : (
          <>
            <LogIn className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            Ingresar
          </>
        )}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-zinc-950 px-4 py-12">
      {/* Fondo con glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#FF3412]/20 blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-orange-500/10 blur-[120px]" />
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF3412]/5 blur-[100px]" />
      </div>

      {/* Patrón de puntos */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.35) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative grid w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-white shadow-2xl shadow-black/50 lg:grid-cols-2">
        {/* Panel de marca */}
        <div className="relative hidden flex-col items-center justify-center gap-6 overflow-hidden bg-gradient-to-br from-black via-zinc-900 to-black p-12 text-center lg:flex">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF3412]/30 blur-[100px]" />
          </div>

          <div className="relative flex flex-col items-center gap-6">
            <div className="rounded-2xl bg-white/5 p-3 ring-1 ring-white/10 backdrop-blur-sm">
              <Image
                src="/logo.png"
                alt="Del Mate"
                width={100}
                height={100}
                className="h-24 w-24 object-contain"
                priority
              />
            </div>

            <div className="flex flex-col items-center gap-2">
              <span className="rounded-full bg-[#FF3412]/15 px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#FF3412] ring-1 ring-[#FF3412]/30">
                Panel de administración
              </span>
              <h1 className="text-3xl font-black uppercase tracking-tight text-white">
                Del Mate{" "}
                <span className="bg-gradient-to-r from-[#FF3412] to-orange-400 bg-clip-text text-transparent">
                  Mayorista
                </span>
              </h1>
            </div>

            <p className="max-w-xs text-sm leading-relaxed text-zinc-400">
              Gestioná categorías, productos y pedidos de forma rápida y segura.
            </p>

            <div className="flex items-center gap-3 border-t border-white/10 pt-6 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
              <ShieldCheck className="h-4 w-4 text-[#FF3412]" />
              Acceso restringido
            </div>
          </div>
        </div>

        {/* Panel de formulario */}
        <div className="flex flex-col items-center justify-center bg-white px-6 py-12 sm:px-12 lg:px-14">
          <div className="w-full max-w-sm">
            <div className="mb-8 flex flex-col items-center gap-3 text-center lg:hidden">
              <div className="rounded-2xl bg-zinc-100 p-3">
                <Image
                  src="/logo.png"
                  alt="Del Mate"
                  width={64}
                  height={64}
                  className="h-16 w-16 object-contain"
                  priority
                />
              </div>
              <h1 className="text-2xl font-black uppercase tracking-tight text-zinc-900">
                Del Mate <span className="text-[#FF3412]">Mayorista</span>
              </h1>
              <p className="text-sm text-zinc-500">Panel de administración</p>
            </div>

            <div className="mb-8 hidden flex-col items-center gap-2 text-center lg:flex">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF3412]/10 ring-1 ring-[#FF3412]/20">
                <ShieldCheck className="h-6 w-6 text-[#FF3412]" strokeWidth={2.2} />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-900">Bienvenido</h2>
              <p className="text-sm text-zinc-500">Ingresá tus credenciales para continuar</p>
            </div>

            <Suspense fallback={<p className="py-8 text-center text-sm text-zinc-400">Cargando...</p>}>
              <LoginForm />
            </Suspense>

            <Link
              href="/"
              className="group mt-8 flex items-center justify-center gap-2 border-t border-zinc-100 pt-6 text-xs font-bold uppercase tracking-widest text-zinc-400 transition-colors hover:text-[#FF3412]"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
              Volver al sitio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}