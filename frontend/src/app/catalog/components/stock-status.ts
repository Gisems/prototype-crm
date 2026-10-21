/** Con 3 o menos unidades el stock se marca como bajo. */
const LOW_STOCK = 3

export function stockStatus(stock: number) {
  if (stock <= 0) return { label: "Sin stock", className: "font-semibold text-destructive" }
  if (stock <= LOW_STOCK) return { label: `Stock: ${stock}`, className: "font-semibold text-warning" }

  return { label: `Stock: ${stock}`, className: "text-muted-foreground" }
}
