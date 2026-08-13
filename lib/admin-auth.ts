export const ADMIN_EMAIL = process.env.KEYSTATIC_ADMIN_EMAIL || "admin@delmatemayorista.com";
export const ADMIN_PASSWORD = process.env.KEYSTATIC_ADMIN_PASSWORD || "DelMateMayorista123@";

export const SESSION_COOKIE = "admin_session";

export async function getSessionToken(): Promise<string> {
  const data = new TextEncoder().encode(`${ADMIN_EMAIL}:${ADMIN_PASSWORD}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
