import { z } from "zod"

import { optionalString, requiredMessage, requiredString, whenValid } from "shared/utils/schema"

import { BILLING_UNITS, ITEM_TYPES, productCurrencySchema, SERVICE_MODALITIES, type Product } from "./response"

/** Un entero escrito a mano: devuelve el mensaje de lo que está mal, o `null` si es válido. */
function wholeNumberError(text: string, minimum: number) {
  const value = Number(text)

  if (Number.isNaN(value)) return "Ingresa un número"
  if (!Number.isInteger(value)) return "Debe ser un entero"
  if (value < minimum) return minimum === 0 ? "No puede ser negativo" : "Debe ser mayor a 0"

  return null
}

export const productFormSchema = z
  .object({
    /** Solo se elige al crear: un producto no se convierte en servicio. */
    type: z.enum(ITEM_TYPES),
    /**
     * Solo se elige al crear: después es la clave de la ruta y el perfil lo muestra deshabilitado.
     * Se guarda en mayúsculas, y el regex evita caracteres que romperían la URL `/catalog/:sku`.
     */
    sku: requiredString(40)
      .pipe(
        z
          .string()
          .regex(/^[A-Za-z0-9._-]+$/, "Solo letras, números, puntos y guiones")
          // `/catalog/import` es la vista de importación: un SKU así no se podría abrir en `/catalog/:sku`.
          .refine((sku) => sku.toUpperCase() !== "IMPORT", "Ese SKU está reservado"),
      )
      .transform((sku) => sku.toUpperCase()),
    name: requiredString(120),
    description: optionalString(500),
    price: requiredString()
      .transform(Number)
      .pipe(z.number({ error: "Ingresa un número" }).min(0, "No puede ser negativo")),
    currency: productCurrencySchema,
    /** Imagen actual o recién elegida; `""` es "sin foto", por eso no es obligatoria. */
    image: z.string(),
    // Solo productos.
    color: optionalString(60),
    size: optionalString(30),
    stock: z.string().trim(),
    // Solo servicios.
    durationMinutes: z.string().trim(),
    modality: z.enum(SERVICE_MODALITIES),
    billingUnit: z.enum(BILLING_UNITS),
  })
  .superRefine(
    (values, ctx) => {
      // El formulario lleva los campos de los dos tipos; solo se exigen los del tipo elegido.
      if (values.type === "product") {
        const error = values.stock === "" ? requiredMessage : wholeNumberError(values.stock, 0)

        if (error) ctx.addIssue({ code: "custom", path: ["stock"], message: error })
      } else if (values.durationMinutes !== "") {
        const error = wholeNumberError(values.durationMinutes, 1)

        if (error) ctx.addIssue({ code: "custom", path: ["durationMinutes"], message: error })
      }
    },
    whenValid("type", "stock", "durationMinutes"),
  )
  // Lo que no es del tipo elegido se descarta: no viaja basura de la otra mitad del formulario.
  .transform((values) => {
    const isProduct = values.type === "product"

    return {
      type: values.type,
      sku: values.sku,
      name: values.name,
      description: values.description ?? "",
      price: values.price,
      currency: values.currency,
      image: values.image,
      color: isProduct ? (values.color ?? "") : "",
      size: isProduct ? (values.size ?? "") : "",
      stock: isProduct ? Number(values.stock) : null,
      durationMinutes: !isProduct && values.durationMinutes !== "" ? Number(values.durationMinutes) : null,
      modality: isProduct ? null : values.modality,
      billingUnit: isProduct ? null : values.billingUnit,
    }
  })

export type ProductFormInput = z.input<typeof productFormSchema>
export type ProductFormValues = z.output<typeof productFormSchema>

export const emptyProductFormInput: ProductFormInput = {
  type: "product",
  sku: "",
  name: "",
  description: "",
  price: "",
  currency: "UYU",
  image: "",
  color: "",
  size: "",
  stock: "0",
  durationMinutes: "",
  modality: "in_person",
  billingUnit: "service",
}

/** Los números van como texto porque es lo que maneja un `<input>`; el schema los convierte al enviar. */
export function toProductFormInput(product: Product): ProductFormInput {
  return {
    type: product.type,
    sku: product.sku,
    name: product.name,
    description: product.description,
    price: String(product.price),
    currency: product.currency,
    image: product.image,
    color: product.color,
    size: product.size,
    stock: product.stock === null ? "0" : String(product.stock),
    durationMinutes: product.durationMinutes === null ? "" : String(product.durationMinutes),
    modality: product.modality ?? "in_person",
    billingUnit: product.billingUnit ?? "service",
  }
}
