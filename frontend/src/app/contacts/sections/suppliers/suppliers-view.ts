import { debounce, parseAsInteger, parseAsString } from "nuqs"

// Búsqueda y página van en la URL (`?q=telas&page=2`) para que recargar o compartir el enlace conserve lo que se ve.

/** La URL se actualiza al dejar de escribir; el campo en sí responde al instante. */
export const suppliersQueryParser = parseAsString.withDefault("").withOptions({ limitUrlUpdates: debounce(300) })

export const suppliersPageParser = parseAsInteger.withDefault(1)

/** Cuántos proveedores entran en una página. */
export const SUPPLIERS_PER_PAGE = 10
