// Autenticación admin: cookie de sesión determinística.
// El token es un hash SHA-256 de email + password + secret, así que nunca
// se guarda nada sensible en la cookie y validar la sesión (middleware,
// edge runtime) es simplemente recalcular el hash y compararlo.

export const ADMIN_SESSION_COOKIE = "delmate_admin_session";

// Fallback de desarrollo: en producción SIEMPRE hay que definir estas env vars.
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@delmatemayorista.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "delmate-admin-dev";
const ADMIN_SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET ?? process.env.KEYSTATIC_SECRET ?? "delmate-dev-secret";

async function sha256Hex(valor: string): Promise<string> {
  const datos = new TextEncoder().encode(valor);
  const hashBuffer = await crypto.subtle.digest("SHA-256", datos);
  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Genera el token determinístico de sesión para un email/password dados.
 */
export async function generarTokenSesion(email: string, password: string): Promise<string> {
  return sha256Hex(`${email.trim().toLowerCase()}:${password}:${ADMIN_SESSION_SECRET}`);
}

/**
 * El token esperado para las credenciales de administrador configuradas.
 */
export async function obtenerTokenEsperado(): Promise<string> {
  return generarTokenSesion(ADMIN_EMAIL, ADMIN_PASSWORD);
}

/**
 * Valida credenciales contra ADMIN_EMAIL / ADMIN_PASSWORD.
 */
export function validarCredenciales(email: string, password: string): boolean {
  return email.trim().toLowerCase() === ADMIN_EMAIL.trim().toLowerCase() && password === ADMIN_PASSWORD;
}
