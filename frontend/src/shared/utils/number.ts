/**
 * Convierte un número escrito a mano o exportado de una planilla: `1150`, `1.150,50`, `1,150.50`, `$ 1.150`.
 * Con coma y punto a la vez, el último es el decimal; con uno solo, es decimal si deja 1 o 2 dígitos
 * detrás (`12,5`) y separador de miles en cualquier otro caso (`1.150`). Devuelve `NaN` si no hay número.
 */
export function parseLocalizedNumber(raw: string): number {
  let text = raw.replaceAll(/[^\d.,-]/g, "")

  if (!text) return Number.NaN

  const lastComma = text.lastIndexOf(",")
  const lastDot = text.lastIndexOf(".")

  if (lastComma > -1 && lastDot > -1) {
    text = lastComma > lastDot ? text.replaceAll(".", "").replace(",", ".") : text.replaceAll(",", "")
  } else if (lastComma > -1) {
    const parts = text.split(",")
    text = parts.length === 2 && (parts[1]?.length ?? 0) <= 2 ? parts.join(".") : text.replaceAll(",", "")
  } else if (text.split(".").length > 2) {
    text = text.replaceAll(".", "")
  } else if (lastDot > -1 && text.length - lastDot - 1 === 3) {
    text = text.replace(".", "")
  }

  return Number.parseFloat(text)
}

/** Separador de miles es-UY: `3000` → `3.000`. */
export function formatNumber(value: number) {
  return new Intl.NumberFormat("es-UY").format(value)
}
