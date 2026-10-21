import { normalizeText } from "shared/utils/string"

import { type ItemType, type Product, productCurrencySchema } from "./response"

export const PRODUCT_SORT_KEYS = ["default", "price-asc", "price-desc", "stock-asc", "stock-desc"] as const

export type ProductSort = (typeof PRODUCT_SORT_KEYS)[number]

export type ProductSortColumn = "price" | "stock"

export type SortDirection = "asc" | "desc"

/** Hacia dónde ordena `sort` en esa columna, o `null` si ordena por otra cosa. */
export function sortDirection(sort: ProductSort, column: ProductSortColumn): SortDirection | null {
  const [sortColumn, direction] = sort.split("-")

  return sortColumn === column ? (direction as SortDirection) : null
}

/** Cada click en el encabezado avanza: sin orden → ascendente → descendente → sin orden. */
export function nextSort(sort: ProductSort, column: ProductSortColumn): ProductSort {
  const direction = sortDirection(sort, column)

  if (direction === null) return `${column}-asc`

  return direction === "asc" ? `${column}-desc` : "default"
}

function matchesQuery(product: Product, query: string) {
  const needle = normalizeText(query.trim())

  return !needle || normalizeText(product.name).includes(needle) || normalizeText(product.sku).includes(needle)
}

const CURRENCY_ORDER: readonly string[] = productCurrencySchema.options

/**
 * No hay tipo de cambio, así que un precio en USD no es comparable con uno en UYU: se agrupa por
 * moneda y se ordena el monto dentro de cada grupo, en vez de mezclar montos de monedas distintas.
 */
function byCurrency(a: Product, b: Product) {
  return CURRENCY_ORDER.indexOf(a.currency) - CURRENCY_ORDER.indexOf(b.currency)
}

/** Un servicio no tiene stock: al ordenar por stock queda siempre al final, sea cual sea la dirección. */
function byStock(a: Product, b: Product, direction: SortDirection) {
  if (a.stock === null || b.stock === null) return Number(a.stock === null) - Number(b.stock === null)

  return direction === "asc" ? a.stock - b.stock : b.stock - a.stock
}

const COMPARATORS: Record<Exclude<ProductSort, "default">, (a: Product, b: Product) => number> = {
  "price-asc": (a, b) => byCurrency(a, b) || a.price - b.price,
  "price-desc": (a, b) => byCurrency(a, b) || b.price - a.price,
  "stock-asc": (a, b) => byStock(a, b, "asc"),
  "stock-desc": (a, b) => byStock(a, b, "desc"),
}

export function filterAndSortProducts(products: Product[], query: string, sort: ProductSort, type: ItemType | "all") {
  const matching = products.filter(
    (product) => (type === "all" || product.type === type) && matchesQuery(product, query),
  )

  return sort === "default" ? matching : matching.toSorted(COMPARATORS[sort])
}
