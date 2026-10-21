import { debounce, parseAsInteger, parseAsString, parseAsStringLiteral } from "nuqs"

import { CUSTOMER_CHANNELS, CUSTOMER_STAGES } from "core/models/customer"

// Búsqueda, filtros y página van en la URL (`?q=ana&stage=won&channel=wa&tag=VIP&page=2`) para que recargar o compartir el
// enlace conserve lo que se ve.

/** La URL se actualiza al dejar de escribir; el campo en sí responde al instante. */
export const customersQueryParser = parseAsString.withDefault("").withOptions({ limitUrlUpdates: debounce(300) })

export const customersStageParser = parseAsStringLiteral([...CUSTOMER_STAGES, "all"]).withDefault("all")

export const customersChannelParser = parseAsStringLiteral([...CUSTOMER_CHANNELS, "all"]).withDefault("all")

export const customersTagParser = parseAsString.withDefault("")

export const customersPageParser = parseAsInteger.withDefault(1)

/** Cuántos clientes entran en una página. */
export const CUSTOMERS_PER_PAGE = 10
