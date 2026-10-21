import type { CustomerChannel, CustomerStage } from "core/models/customer"

export const CHANNEL_LABELS: Record<CustomerChannel, string> = {
  wa: "WhatsApp",
  ig: "Instagram",
  fb: "Messenger",
}

/** Cada canal con el color de su marca, como en Configuración. */
export const CHANNEL_CLASSES: Record<CustomerChannel, string> = {
  wa: "bg-[#25d366]/15 text-[#128c7e]",
  ig: "bg-[#e1306c]/15 text-[#c13584]",
  fb: "bg-[#0866ff]/15 text-[#0866ff]",
}

export const STAGE_LABELS: Record<CustomerStage, string> = {
  new: "Nuevo lead",
  contacted: "Contactado",
  negotiation: "Negociación",
  won: "Ganado",
  lost: "Perdido",
}

export const STAGE_CLASSES: Record<CustomerStage, string> = {
  new: "bg-muted text-muted-foreground",
  contacted: "bg-secondary text-secondary-foreground",
  negotiation: "bg-primary-light/15 text-primary-light",
  won: "bg-success/15 text-success",
  lost: "bg-destructive/10 text-destructive",
}
