import { HttpFailure } from "core/lib/client/failure"
import { type SaveSupplierDto, type Supplier, supplierSchema } from "core/models/supplier"

/**
 * MOCK: proveedores de ejemplo, en memoria: los cambios se pierden al recargar (los RUC son inventados). El prototipo no tenía
 * proveedores, así que estos datos son inventados, en línea con lo que vende el catálogo. Cuando exista el
 * backend, cada método pasa a `crmClient` con su `decode` y los hooks y la pantalla no cambian.
 */
let mockSuppliers: Supplier[] = [
  {
    id: 1,
    name: "Textiles del Plata",
    ruc: "214563780018",
    contactName: "Laura Benítez",
    phone: "+598 2 900 1100",
    email: "ventas@textilesdelplata.uy",
    category: "Telas",
    notes: "Entrega los martes y jueves.",
  },
  {
    id: 2,
    name: "Cueros Montevideo",
    ruc: "217821450019",
    contactName: "Gustavo Pérez",
    phone: "+598 99 555 010",
    email: "gustavo@cuerosmvd.uy",
    category: "Cuero",
    notes: "",
  },
  {
    id: 3,
    name: "Calzados Uruguay S.A.",
    ruc: "211234560012",
    contactName: "Ivana Rossi",
    phone: "+598 2 900 2200",
    email: "pedidos@calzadosuy.com",
    category: "Calzado",
    notes: "Pedido mínimo de 12 pares.",
  },
  {
    id: 4,
    name: "Mercería Central",
    ruc: "",
    contactName: "Daniel Cabrera",
    phone: "+598 98 444 777",
    email: "",
    category: "Insumos",
    notes: "Botones, cierres e hilos.",
  },
  {
    id: 5,
    name: "Sastrería Hnos. Vega",
    ruc: "219876540015",
    contactName: "Hernán Vega",
    phone: "+598 99 321 654",
    email: "hernan@sastreriavega.uy",
    category: "Confección",
    notes: "Trajes a medida: 10 días de entrega.",
  },
  {
    id: 6,
    name: "Hilados Rioplatenses",
    ruc: "213344550010",
    contactName: "Marta Olivera",
    phone: "+598 2 900 3300",
    email: "compras@hilados.uy",
    category: "Telas",
    notes: "Lana y algodón por kilo.",
  },
  {
    id: 7,
    name: "Botones y Más",
    ruc: "",
    contactName: "Sergio Díaz",
    phone: "+598 98 111 222",
    email: "",
    category: "Insumos",
    notes: "",
  },
  {
    id: 8,
    name: "Packaging Oriental",
    ruc: "216677880017",
    contactName: "Natalia Ferrer",
    phone: "+598 2 900 4400",
    email: "natalia@packagingoriental.uy",
    category: "Embalaje",
    notes: "Bolsas y cajas con logo.",
  },
  {
    id: 9,
    name: "Suelas del Sur",
    ruc: "218899000011",
    contactName: "Pablo Giménez",
    phone: "+598 99 777 888",
    email: "pablo@suelasdelsur.uy",
    category: "Calzado",
    notes: "Pedido mínimo de 20 pares.",
  },
  {
    id: 10,
    name: "Transporte Rápido",
    ruc: "212233440014",
    contactName: "Elena Cruz",
    phone: "+598 2 900 5500",
    email: "operaciones@transporterapido.uy",
    category: "Logística",
    notes: "Envíos a todo el país.",
  },
  {
    id: 11,
    name: "Etiquetas Uruguay",
    ruc: "215566770013",
    contactName: "Ramiro Paz",
    phone: "+598 98 333 444",
    email: "ramiro@etiquetasuy.com",
    category: "Embalaje",
    notes: "Etiquetas tejidas y de cartón.",
  },
]

/** Simula la latencia de red para que el estado de carga sea visible. */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export function createSupplierService() {
  return {
    async list(): Promise<Supplier[]> {
      await delay(300)

      return mockSuppliers.map((supplier) => supplierSchema.parse(supplier))
    },

    async create(dto: SaveSupplierDto): Promise<Supplier> {
      await delay(500)

      const nextId = Math.max(0, ...mockSuppliers.map((supplier) => supplier.id)) + 1
      const created = supplierSchema.parse({ id: nextId, ...dto })
      mockSuppliers = [...mockSuppliers, created]

      return created
    },

    async update(id: number, dto: SaveSupplierDto): Promise<Supplier> {
      await delay(500)

      if (!mockSuppliers.some((supplier) => supplier.id === id)) {
        throw new HttpFailure("Supplier not found", { kind: "http", status: 404 })
      }

      const updated = supplierSchema.parse({ id, ...dto })
      mockSuppliers = mockSuppliers.map((supplier) => (supplier.id === id ? updated : supplier))

      return updated
    },

    async remove(id: number): Promise<void> {
      await delay(400)

      mockSuppliers = mockSuppliers.filter((supplier) => supplier.id !== id)
    },
  }
}
