import { HttpFailure } from "core/lib/client/failure"
import { type Customer, customerSchema, type SaveCustomerDto } from "core/models/customer"

/**
 * MOCK: los clientes del prototipo (`docs/prototype`), en memoria: los cambios se pierden al recargar. El
 * responsable es el id de un miembro del equipo (`core/services/team`). Cuando exista el backend, cada método
 * pasa a `crmClient` con su `decode` y los hooks y la pantalla no cambian.
 */
let mockCustomers: Customer[] = [
  {
    id: 1,
    name: "Camila Suárez",
    channel: "wa",
    phone: "+598 99 123 456",
    whatsappId: "59899123456",
    tags: ["Lead", "Urgente"],
    stage: "negotiation",
    value: 2400,
    assignedTo: 1,
  },
  {
    id: 2,
    name: "Rodrigo Torres",
    channel: "ig",
    phone: "+598 99 234 567",
    whatsappId: "",
    tags: ["VIP"],
    stage: "contacted",
    value: 3200,
    assignedTo: 2,
  },
  {
    id: 3,
    name: "Mariana Gómez",
    channel: "fb",
    phone: "+598 99 345 678",
    whatsappId: "",
    tags: [],
    stage: "won",
    value: 1150,
    assignedTo: 1,
  },
  {
    id: 4,
    name: "Franco Pereyra",
    channel: "wa",
    phone: "+598 99 456 789",
    whatsappId: "59899456789",
    tags: ["Lead"],
    stage: "new",
    value: 1800,
    assignedTo: 3,
  },
  {
    id: 5,
    name: "Natalia Bianchi",
    channel: "wa",
    phone: "+598 99 567 890",
    whatsappId: "59899567890",
    tags: [],
    stage: "won",
    value: 980,
    assignedTo: 2,
  },
  {
    id: 6,
    name: "Lucía Ferreira",
    channel: "ig",
    phone: "+598 99 678 901",
    whatsappId: "",
    tags: [],
    stage: "new",
    value: 950,
    assignedTo: 3,
  },
  {
    id: 7,
    name: "Ana Duarte",
    channel: "wa",
    phone: "+598 99 789 012",
    whatsappId: "59899789012",
    tags: [],
    stage: "contacted",
    value: 1400,
    assignedTo: 2,
  },
  {
    id: 8,
    name: "Martín Silva",
    channel: "fb",
    phone: "+598 99 890 123",
    whatsappId: "",
    tags: [],
    stage: "negotiation",
    value: 5600,
    assignedTo: 1,
  },
  {
    id: 9,
    name: "Pablo Núñez",
    channel: "wa",
    phone: "+598 99 901 234",
    whatsappId: "59899901234",
    tags: [],
    stage: "lost",
    value: 800,
    assignedTo: 3,
  },
  {
    id: 10,
    name: "Valentina Rojas",
    channel: "wa",
    phone: "+598 99 012 345",
    whatsappId: "59899012345",
    tags: ["Lead"],
    stage: "new",
    value: 1250,
    assignedTo: 2,
  },
  {
    id: 11,
    name: "Diego Morales",
    channel: "ig",
    phone: "+598 99 112 233",
    whatsappId: "",
    tags: [],
    stage: "contacted",
    value: 2100,
    assignedTo: 1,
  },
  {
    id: 12,
    name: "Sofía Castro",
    channel: "wa",
    phone: "+598 99 223 344",
    whatsappId: "59899223344",
    tags: ["VIP"],
    stage: "won",
    value: 4300,
    assignedTo: 3,
  },
  {
    id: 13,
    name: "Joaquín Lemos",
    channel: "fb",
    phone: "+598 99 334 455",
    whatsappId: "",
    tags: [],
    stage: "negotiation",
    value: 1700,
    assignedTo: 2,
  },
  {
    id: 14,
    name: "Carolina Vidal",
    channel: "wa",
    phone: "+598 99 445 566",
    whatsappId: "59899445566",
    tags: ["Urgente"],
    stage: "contacted",
    value: 890,
    assignedTo: null,
  },
]

/** Simula la latencia de red para que el estado de carga sea visible. */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export function createCustomerService() {
  return {
    async list(): Promise<Customer[]> {
      await delay(300)

      return mockCustomers.map((customer) => customerSchema.parse(customer))
    },

    async create(dto: SaveCustomerDto): Promise<Customer> {
      await delay(500)

      const nextId = Math.max(0, ...mockCustomers.map((customer) => customer.id)) + 1
      const created = customerSchema.parse({ id: nextId, ...dto })
      mockCustomers = [...mockCustomers, created]

      return created
    },

    async update(id: number, dto: SaveCustomerDto): Promise<Customer> {
      await delay(500)

      if (!mockCustomers.some((customer) => customer.id === id)) {
        throw new HttpFailure("Customer not found", { kind: "http", status: 404 })
      }

      const updated = customerSchema.parse({ id, ...dto })
      mockCustomers = mockCustomers.map((customer) => (customer.id === id ? updated : customer))

      return updated
    },

    async remove(id: number): Promise<void> {
      await delay(400)

      mockCustomers = mockCustomers.filter((customer) => customer.id !== id)
    },
  }
}
