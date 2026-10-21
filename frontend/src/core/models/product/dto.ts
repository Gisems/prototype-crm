import type { ProductFormValues } from "./form"

/** Lo que viaja al crear un ítem: el formulario ya lo dejó con la forma de su tipo (ver `productFormSchema`). */
export type CreateProductDto = ProductFormValues

/** El tipo y el SKU identifican al ítem: al editar no viajan en el cuerpo. */
export type UpdateProductDto = Omit<CreateProductDto, "sku" | "type">

export function toCreateProductDto(values: ProductFormValues): CreateProductDto {
  return values
}

export function toUpdateProductDto(values: ProductFormValues): UpdateProductDto {
  const { sku: _sku, type: _type, ...dto } = values

  return dto
}
