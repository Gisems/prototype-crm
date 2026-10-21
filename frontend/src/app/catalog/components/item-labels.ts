import type { BillingUnit, ItemType, Product, ServiceModality } from "core/models/product"
import { formatMoney } from "shared/utils/currency"

import { stockStatus } from "./stock-status"

export const ITEM_TYPE_LABELS: Record<ItemType, string> = {
  product: "Producto",
  service: "Servicio",
}

export const MODALITY_LABELS: Record<ServiceModality, string> = {
  in_person: "Presencial",
  online: "Online",
  at_home: "A domicilio",
}

/** Cómo se llama cada unidad de cobro en el selector del formulario. */
export const BILLING_UNIT_LABELS: Record<BillingUnit, string> = {
  session: "Por sesión",
  hour: "Por hora",
  service: "Por servicio",
}

/** Lo que va detrás de la barra en el precio de un servicio: "$ 1.800 / sesión". */
const BILLING_UNIT_SUFFIX: Record<BillingUnit, string> = {
  session: "sesión",
  hour: "hora",
  service: "servicio",
}

/** El precio tal como se muestra: el de un servicio lleva su unidad de cobro. */
export function formatItemPrice(product: Product) {
  const price = formatMoney(product.price, product.currency)

  return product.billingUnit ? `${price} / ${BILLING_UNIT_SUFFIX[product.billingUnit]}` : price
}

/** La línea de detalle de un ítem: color y talle en un producto; duración y modalidad en un servicio. */
export function itemDetail(product: Product) {
  const parts =
    product.type === "service"
      ? [
          product.durationMinutes !== null && `${product.durationMinutes} min`,
          product.modality && MODALITY_LABELS[product.modality],
        ]
      : [product.color, product.size && `Talle ${product.size}`]

  return parts.filter(Boolean).join(" · ") || "—"
}

/** El estado de un ítem: el stock de un producto; un servicio no se cuenta, así que solo dice qué es. */
export function itemStatus(product: Product) {
  if (product.type === "service") return { label: ITEM_TYPE_LABELS.service, className: "text-muted-foreground" }

  return stockStatus(product.stock ?? 0)
}
