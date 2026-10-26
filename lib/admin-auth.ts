// Cuenta administrativa de delmatemayorista.
// 1. Sesión del panel: el middleware valida la cookie contra un token SHA-256
//    derivado de las credenciales (getSessionToken).
// 2. PocketBase: las mismas credenciales son un superuser de PB
//    (pbSuperuserAuth) para las operaciones de admin del panel.

export const ADMIN_EMAIL =
  process.env.KEYSTATIC_ADMIN_EMAIL || "admin@delmatemayorista.com";
export const ADMIN_PASSWORD =
  process.env.KEYSTATIC_ADMIN_PASSWORD || "DelMateMayorista123@";

export const SESSION_COOKIE = "admin_session";

export async function getSessionToken(): Promise<string> {
  const data = new TextEncoder().encode(`${ADMIN_EMAIL}:${ADMIN_PASSWORD}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function pbSuperuserAuth(): Promise<string> {
  // Autentica contra _superusers de PB con las credenciales del admin.
  const res = await fetch(
    `${
      process.env.POCKETBASE_URL ?? "http://127.0.0.1:8096"
    }/api/collections/_superusers/auth-with-password`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        identity: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      }),
      cache: "no-store",
    },
  );
  if (!res.ok) {
    throw new Error("No se pudo autenticar el superuser de PocketBase.");
  }
  const data = (await res.json()) as { token: string };
  return data.token;
}
