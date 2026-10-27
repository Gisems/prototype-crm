import { addDays } from "date-fns"

import { HttpFailure } from "core/lib/client/failure"
import { type CalendarEvent, calendarEventSchema, type SaveEventDto, toIsoDate } from "core/models/event"

/**
 * MOCK: los eventos del prototipo (`docs/prototype`), en memoria: los cambios se pierden al recargar. Las fechas
 * son relativas a hoy para que el mes en curso siempre tenga eventos. El contacto es el id de un cliente
 * (`core/services/contacts`) y el responsable, el de un miembro del equipo (`core/services/team`). Cuando exista el
 * backend, cada método pasa a `crmClient` con su `decode` y los hooks y la pantalla no cambian.
 */
const day = (offset: number) => toIsoDate(addDays(new Date(), offset))

let mockEvents: CalendarEvent[] = [
  {
    id: 1,
    title: "Llamada de seguimiento",
    type: "call",
    date: day(0),
    time: "10:00",
    customerId: 1,
    assignedTo: 1,
    notes: "Confirmar las medidas del pedido.",
  },
  {
    id: 2,
    title: "Reunión con proveedor",
    type: "meeting",
    date: day(0),
    time: "10:30",
    customerId: null,
    assignedTo: 2,
    notes: "",
  },
  {
    id: 3,
    title: "Entrega del pedido #1042",
    type: "delivery",
    date: day(0),
    time: "16:00",
    customerId: 3,
    assignedTo: 1,
    notes: "",
  },
  {
    id: 4,
    title: "Renovar el plan de WhatsApp",
    type: "reminder",
    date: day(1),
    time: "09:00",
    customerId: null,
    assignedTo: null,
    notes: "",
  },
  {
    id: 5,
    title: "Presentar la propuesta",
    type: "call",
    date: day(1),
    time: "11:00",
    customerId: 2,
    assignedTo: 2,
    notes: "Llevar el catálogo actualizado.",
  },
  {
    id: 6,
    title: "Demo del catálogo",
    type: "meeting",
    date: day(2),
    time: "15:00",
    customerId: 1,
    assignedTo: 1,
    notes: "",
  },
  {
    id: 7,
    title: "Entrega del pedido #1045",
    type: "delivery",
    date: day(3),
    time: "12:00",
    customerId: 4,
    assignedTo: 2,
    notes: "",
  },
  {
    id: 8,
    title: "Cerrar la caja del día",
    type: "reminder",
    date: day(-1),
    time: "18:00",
    customerId: null,
    assignedTo: 3,
    notes: "",
  },
  {
    id: 9,
    title: "Llamada de postventa",
    type: "call",
    date: day(-2),
    time: "14:30",
    customerId: 2,
    assignedTo: 2,
    notes: "",
  },
  {
    id: 10,
    title: "Reunión de equipo",
    type: "meeting",
    date: day(5),
    time: "11:00",
    customerId: null,
    assignedTo: 1,
    notes: "Revisar las metas del mes.",
  },
  {
    id: 11,
    title: "Entrega del pedido #1038",
    type: "delivery",
    date: day(-4),
    time: "17:00",
    customerId: 1,
    assignedTo: 1,
    notes: "",
  },
  {
    id: 12,
    title: "Llamada con lead nuevo",
    type: "call",
    date: day(8),
    time: "10:00",
    customerId: 4,
    assignedTo: 3,
    notes: "",
  },
]

/** Simula la latencia de red para que el estado de carga sea visible. */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function findEvent(id: number) {
  const event = mockEvents.find((item) => item.id === id)

  if (!event) throw new HttpFailure("Event not found", { kind: "http", status: 404 })

  return event
}

export function createEventService() {
  return {
    async list(): Promise<CalendarEvent[]> {
      await delay(300)

      return mockEvents.map((event) => calendarEventSchema.parse(event))
    },

    async create(dto: SaveEventDto): Promise<CalendarEvent> {
      await delay(500)

      const nextId = Math.max(0, ...mockEvents.map((event) => event.id)) + 1
      const created = calendarEventSchema.parse({ id: nextId, ...dto })
      mockEvents = [...mockEvents, created]

      return created
    },

    async update(id: number, dto: SaveEventDto): Promise<CalendarEvent> {
      await delay(500)

      const updated = { ...findEvent(id), ...dto }
      mockEvents = mockEvents.map((item) => (item.id === id ? updated : item))

      return updated
    },

    async remove(id: number): Promise<void> {
      await delay(400)

      findEvent(id)
      mockEvents = mockEvents.filter((item) => item.id !== id)
    },
  }
}
