import type { CustomerChannel } from "core/models/customer"
import type { OrderStatus } from "core/models/dashboard"

export const CHANNEL_LABELS: Record<CustomerChannel, string> = {
  wa: "WhatsApp",
  ig: "Instagram",
  fb: "Messenger",
}

/** El color de la marca de cada canal, como en Configuración. */
export const CHANNEL_COLORS: Record<CustomerChannel, string> = {
  wa: "#25d366",
  ig: "#e1306c",
  fb: "#0866ff",
}

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pendiente",
  paid: "Pagado",
  delivered: "Entregado",
  cancelled: "Cancelado",
}

export const STATUS_CLASSES: Record<OrderStatus, string> = {
  pending: "bg-warning",
  paid: "bg-primary-light",
  delivered: "bg-success",
  cancelled: "bg-destructive",
}
