"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff, Loader2, Lock, Mail, TriangleAlert } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const emailId = useId();
  const passwordId = useId();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "No se pudo iniciar sesión.");
      }
      router.push("/keystatic");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white lg:flex-row">
      {/* Panel de marca */}
      <div className="flex flex-col justify-between gap-10 bg-[#FF3412] px-6 py-8 sm:px-10 sm:py-10 lg:w-[46%] lg:px-16 lg:py-16">
        <Link
          href="/"
          className="inline-flex w-fit items-center gap-2 text-sm font-bold uppercase tracking-wide text-white/90 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
          Volver al sitio
        </Link>

        <div className="flex flex-col items-start gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white sm:h-20 sm:w-20">
              <Image
                src="/logo.png"
                alt=""
                width={80}
                height={80}
                className="h-11 w-11 object-contain sm:h-14 sm:w-14"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-[family-name:var(--font-wood-type)] text-2xl font-black uppercase tracking-widest text-white sm:text-3xl">
                Mayorista
              </span>
              <span className="mt-1 text-sm font-bold uppercase tracking-[0.2em] text-white/80">
                Del Mate
              </span>
            </div>
          </div>

          <h1 className="max-w-md text-3xl font-black uppercase leading-[1.05] text-white sm:text-4xl lg:text-[2.75rem]">
            Panel de administración
          </h1>
          <p className="max-w-sm text-sm text-white/80 sm:text-base">
            Gestioná categorías, productos, banners y pedidos del sitio.
          </p>
        </div>

        <p className="hidden text-xs font-bold uppercase tracking-[0.2em] text-white/60 lg:block">
          Acceso restringido
        </p>
      </div>

      {/* Panel de login */}
      <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10 lg:px-16">
        <form onSubmit={handleSubmit} className="w-full max-w-sm" noValidate>
          <h2 className="text-2xl font-black uppercase text-black">Iniciar sesión</h2>
          <p className="mt-1 mb-8 text-sm text-black/60">
            Ingresá con tu cuenta de administrador.
          </p>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor={emailId} className="text-sm font-bold text-black">
                Email
              </label>
              <div className="relative">
                <Mail
                  className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-black/40"
                  strokeWidth={2}
                />
                <input
                  id={emailId}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  autoComplete="email"
                  placeholder="tu@email.com"
                  className="w-full rounded-sm border-2 border-black/15 py-2.5 pr-3 pl-10 text-sm font-medium text-black placeholder:text-black/40 transition-colors focus:border-black focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor={passwordId} className="text-sm font-bold text-black">
                Contraseña
              </label>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-black/40"
                  strokeWidth={2}
                />
                <input
                  id={passwordId}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full rounded-sm border-2 border-black/15 py-2.5 pr-10 pl-10 text-sm font-medium text-black placeholder:text-black/40 transition-colors focus:border-black focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  className="absolute top-1/2 right-3 flex h-5 w-5 -translate-y-1/2 items-center justify-center text-black/40 transition-colors hover:text-black"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" strokeWidth={2} />
                  ) : (
                    <Eye className="h-4 w-4" strokeWidth={2} />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-sm border-2 border-[#FF3412] bg-[#FF3412]/5 px-3 py-2.5"
              >
                <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-[#FF3412]" strokeWidth={2.5} />
                <p className="text-sm font-bold text-[#FF3412]">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-sm bg-[#FF3412] px-4 py-3 text-sm font-bold uppercase text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting && (
                <Loader2 className="h-4 w-4 shrink-0 animate-spin motion-reduce:animate-none" strokeWidth={2.5} />
              )}
              {submitting ? "Ingresando..." : "Ingresar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
