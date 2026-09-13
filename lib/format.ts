// Formateo manual: en-US, separador de miles a coma. Asume precios enteros en pesos (sin decimales).
// Los precios cargados como "10.011" (diez mil once) llegan como decimal 10.011
// porque el campo numérico interpreta el punto como separador decimal.
// Si el valor tiene exactamente 3 decimales, se interpreta como miles: 10.011 -> 10011.
export function normalizePrice(value: number): number {
  if (!Number.isFinite(value)) return 0;
  if (Number.isInteger(value)) return value;
  const parts = value.toString().split(".");
  if (parts[1]?.length === 3) return Number(`${parts[0]}${parts[1]}`);
  return Math.round(value);
}

export function formatPrice(value: number): string {
  return `$${normalizePrice(value).toLocaleString("en-US")}`;
}
