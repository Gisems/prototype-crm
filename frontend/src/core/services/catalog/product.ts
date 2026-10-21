import camperaImage from "asserts/campera de jeans.jpg"
import carteraImage from "asserts/cartera.jpg"
import trajeImage from "asserts/traje.jpg"
import vestidoImage from "asserts/vestido.jpg"
import zapatillasImage from "asserts/zapatillas.jpg"

import { HttpFailure } from "core/lib/client/failure"
import { type CreateProductDto, type Product, productSchema, type UpdateProductDto } from "core/models/product"

/**
 * MOCK: el backend aún no tiene módulo de catálogo, así que esto devuelve los productos del
 * prototipo (`docs/prototype`) y tres servicios de ejemplo. Las ediciones viven en memoria y se pierden al recargar. Cuando exista
 * el backend, cada método pasa a `crmClient` con su `decode` y los hooks y la pantalla no cambian.
 */
const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    type: "product",
    sku: "VES-FLO-M",
    name: "Vestido floreado",
    description: "Vestido midi de tela liviana con estampado floral, ideal para primavera y verano.",
    price: 1150,
    currency: "UYU",
    color: "Floreado",
    size: "M",
    stock: 12,
    durationMinutes: null,
    modality: null,
    billingUnit: null,
    image: vestidoImage,
  },
  {
    id: 2,
    type: "product",
    sku: "CAR-CUE-NE",
    name: "Cartera de cuero",
    description: "Cartera de cuero genuino con cierre metálico y compartimento interior con cierre.",
    price: 1200,
    currency: "UYU",
    color: "Negro",
    size: "Único",
    stock: 5,
    durationMinutes: null,
    modality: null,
    billingUnit: null,
    image: carteraImage,
  },
  {
    id: 3,
    type: "product",
    sku: "ZAP-URB-42",
    name: "Zapatillas urbanas",
    description: "Zapatillas de uso diario con suela de goma antideslizante y plantilla acolchada.",
    price: 1150,
    currency: "UYU",
    color: "Blanco",
    size: "42",
    stock: 20,
    durationMinutes: null,
    modality: null,
    billingUnit: null,
    image: zapatillasImage,
  },
  {
    id: 4,
    type: "product",
    sku: "TRA-MED-L",
    name: "Traje a medida",
    description: "Traje de dos piezas confeccionado a medida en lana. Incluye saco y pantalón.",
    price: 140,
    currency: "USD",
    color: "Azul marino",
    size: "L",
    stock: 2,
    durationMinutes: null,
    modality: null,
    billingUnit: null,
    image: trajeImage,
  },
  {
    id: 5,
    type: "product",
    sku: "CAM-JEA-M",
    name: "Campera de jean",
    description: "Campera de jean clásica con botones metálicos y dos bolsillos frontales.",
    price: 1400,
    currency: "UYU",
    color: "Celeste",
    size: "M",
    stock: 0,
    durationMinutes: null,
    modality: null,
    billingUnit: null,
    image: camperaImage,
  },
  {
    id: 6,
    type: "service",
    sku: "SRV-ASE-60",
    name: "Asesoría de imagen",
    description: "Sesión personalizada para armar tu guardarropa según tu estilo y tu agenda.",
    price: 1800,
    currency: "UYU",
    color: "",
    size: "",
    stock: null,
    durationMinutes: 60,
    modality: "in_person",
    billingUnit: "session",
    image: "",
  },
  {
    id: 7,
    type: "service",
    sku: "SRV-ARR-001",
    name: "Arreglo de prendas",
    description: "Ajustes y arreglos de costura, listos en el día.",
    price: 350,
    currency: "UYU",
    color: "",
    size: "",
    stock: null,
    durationMinutes: 30,
    modality: "in_person",
    billingUnit: "service",
    image: "",
  },
  {
    id: 8,
    type: "service",
    sku: "SRV-PRU-ONL",
    name: "Prueba virtual de talles",
    description: "Videollamada para elegir talle y modelo antes de comprar.",
    price: 600,
    currency: "UYU",
    color: "",
    size: "",
    stock: null,
    durationMinutes: 20,
    modality: "online",
    billingUnit: "hour",
    image: "",
  },
]

/** Simula la latencia de red para que el estado de carga sea visible. */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function findBySku(sku: string) {
  const product = MOCK_PRODUCTS.find((item) => item.sku === sku)

  if (!product) throw new HttpFailure("Product not found", { kind: "http", status: 404 })

  return product
}

export function createProductService() {
  return {
    async list(): Promise<Product[]> {
      await delay(400)

      return MOCK_PRODUCTS.map((product) => productSchema.parse(product))
    },

    /** El SKU es la clave pública del producto (`/catalog/:sku`), por eso se busca por él y no por `id`. */
    async getBySku(sku: string): Promise<Product> {
      await delay(300)

      return productSchema.parse(findBySku(sku))
    },

    /** El SKU es único: repetirlo es un 409, y el formulario lo muestra en el campo. */
    async create(dto: CreateProductDto): Promise<Product> {
      await delay(400)

      if (MOCK_PRODUCTS.some((product) => product.sku === dto.sku)) {
        throw new HttpFailure("A product with this SKU already exists", { kind: "http", status: 409 })
      }

      const nextId = Math.max(0, ...MOCK_PRODUCTS.map((product) => product.id)) + 1
      const created = productSchema.parse({ id: nextId, ...dto })
      MOCK_PRODUCTS.push(created)

      return created
    },

    /**
     * Importa por SKU: el que ya existe se actualiza y el nuevo se crea. Si el archivo no trae imagen
     * para un producto existente, conserva la que ya tenía.
     */
    async importMany(dtos: CreateProductDto[]): Promise<{ created: number; updated: number }> {
      await delay(600)

      let created = 0
      let updated = 0

      for (const dto of dtos) {
        const index = MOCK_PRODUCTS.findIndex((product) => product.sku === dto.sku)
        const current = MOCK_PRODUCTS[index]

        if (current) {
          MOCK_PRODUCTS[index] = productSchema.parse({ ...current, ...dto, image: dto.image || current.image })
          updated++
        } else {
          const nextId = Math.max(0, ...MOCK_PRODUCTS.map((product) => product.id)) + 1
          MOCK_PRODUCTS.push(productSchema.parse({ id: nextId, ...dto }))
          created++
        }
      }

      return { created, updated }
    },

    async update(sku: string, dto: UpdateProductDto): Promise<Product> {
      await delay(400)

      const updated = productSchema.parse({ ...findBySku(sku), ...dto })
      MOCK_PRODUCTS[MOCK_PRODUCTS.findIndex((product) => product.sku === sku)] = updated

      return updated
    },
  }
}
