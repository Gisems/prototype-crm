import type { CalendarEvent } from "core/models/event"

/** Alto de una hora en la grilla, en píxeles. */
export const HOUR_HEIGHT = 56

/** Los eventos no tienen duración: cada uno ocupa una hora en la grilla. */
const EVENT_MINUTES = 60

export const HOURS = Array.from({ length: 24 }, (_, hour) => hour)

function toMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number)

  return (hours ?? 0) * 60 + (minutes ?? 0)
}

export interface PlacedEvent {
  event: CalendarEvent
  /** Distancia desde el borde superior de la grilla, en píxeles. */
  top: number
  /** Carril horizontal, para que los eventos que se pisan queden uno al lado del otro. */
  lane: number
  lanes: number
}

/** Ubica los eventos de un día (ordenados por hora): cada uno va en el primer carril que ya esté libre. */
export function placeEvents(events: CalendarEvent[]): PlacedEvent[] {
  const laneEnds: number[] = []
  const placed = events.map((event) => {
    const start = toMinutes(event.time)
    const free = laneEnds.findIndex((end) => end <= start)
    const lane = free === -1 ? laneEnds.length : free
    laneEnds[lane] = start + EVENT_MINUTES

    return { event, top: (start / 60) * HOUR_HEIGHT, lane }
  })

  return placed.map((item) => ({ ...item, lanes: laneEnds.length }))
}
