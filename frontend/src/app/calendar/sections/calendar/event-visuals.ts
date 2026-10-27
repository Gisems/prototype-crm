import type { EventType } from "core/models/event"

export const EVENT_LABELS: Record<EventType, string> = {
  call: "Llamada",
  meeting: "Reunión",
  delivery: "Entrega",
  reminder: "Recordatorio",
}

/** Cada tipo con su color: un borde a la izquierda y un fondo suave, para que el texto siga legible. */
export const EVENT_CLASSES: Record<EventType, string> = {
  call: "border-primary-light bg-primary-light/10",
  meeting: "border-primary bg-primary/10",
  delivery: "border-success bg-success/10",
  reminder: "border-warning bg-secondary/60",
}

export const EVENT_DOT_CLASSES: Record<EventType, string> = {
  call: "bg-primary-light",
  meeting: "bg-primary",
  delivery: "bg-success",
  reminder: "bg-warning",
}
