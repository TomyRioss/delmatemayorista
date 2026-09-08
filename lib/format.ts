// Formateo manual: en-US, separador de miles a coma. Asume precios enteros en pesos (sin decimales).
export function formatPrice(value: number): string {
  return `$${Math.round(value).toLocaleString("en-US")}`;
}
