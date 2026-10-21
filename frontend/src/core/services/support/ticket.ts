import { type CreateTicketDto, type Ticket, ticketSchema } from "core/models/support"

/**
 * MOCK: las consultas viven en memoria y se pierden al recargar. Cuando exista el backend, cada método
 * pasa a `crmClient` con su `decode` y los hooks y la pantalla no cambian.
 */
const MOCK_TICKETS: Ticket[] = []

/** Simula la latencia de red para que el estado de carga sea visible. */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export function createTicketService() {
  return {
    /** Las más recientes primero. */
    async list(): Promise<Ticket[]> {
      await delay(300)

      return MOCK_TICKETS.map((ticket) => ticketSchema.parse(ticket)).toReversed()
    },

    async create(dto: CreateTicketDto): Promise<Ticket> {
      await delay(500)

      const nextId = Math.max(0, ...MOCK_TICKETS.map((ticket) => ticket.id)) + 1
      const created = ticketSchema.parse({ id: nextId, ...dto, createdAt: new Date().toISOString() })
      MOCK_TICKETS.push(created)

      return created
    },
  }
}
