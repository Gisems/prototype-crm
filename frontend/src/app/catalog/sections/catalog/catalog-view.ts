import { debounce, parseAsInteger, parseAsNumberLiteral, parseAsString, parseAsStringLiteral } from "nuqs"

import { ITEM_TYPES, PRODUCT_SORT_KEYS } from "core/models/product"

export const CATALOG_VIEWS = ["cards", "list"] as const

export type CatalogView = (typeof CATALOG_VIEWS)[number]

/** Cuántos productos entran en una página; el primero es el valor por defecto. */
export const PAGE_SIZES = [10, 20, 50, 100] as const

export type PageSize = (typeof PAGE_SIZES)[number]

// Vista, búsqueda, orden y paginación van en la URL (`?view=list&q=vestido&sort=price-asc&page=2&pageSize=20`)
// para que recargar o compartir el enlace conserve lo que se ve.
export const catalogViewParser = parseAsStringLiteral(CATALOG_VIEWS).withDefault("cards")

/** La URL se actualiza al dejar de escribir; el campo en sí responde al instante. */
export const catalogQueryParser = parseAsString.withDefault("").withOptions({ limitUrlUpdates: debounce(300) })

export const catalogSortParser = parseAsStringLiteral(PRODUCT_SORT_KEYS).withDefault("default")

export const catalogPageParser = parseAsInteger.withDefault(1)

export const catalogPageSizeParser = parseAsNumberLiteral(PAGE_SIZES).withDefault(PAGE_SIZES[0])

export const catalogTypeParser = parseAsStringLiteral([...ITEM_TYPES, "all"]).withDefault("all")
