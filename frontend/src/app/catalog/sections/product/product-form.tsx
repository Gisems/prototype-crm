import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import {
  type Product,
  type ProductFormInput,
  type ProductFormValues,
  productFormSchema,
  toProductFormInput,
} from "core/models/product"
import { Button } from "shared/components/ui/button"
import { Form, FormField } from "shared/components/ui/form"
import { Input } from "shared/components/ui/input"

import { ITEM_TYPE_LABELS } from "../../components/item-labels"
import { ProductFields } from "../../components/product-fields"
import { ProductPhoto } from "./product-photo"

interface ProductFormProps {
  product: Product
  isSaving: boolean
  /** `onSaved` recibe el producto guardado para que el formulario tome sus valores como los nuevos "sin cambios". */
  onSubmit: (values: ProductFormValues, onSaved: (saved: Product) => void) => void
}

export function ProductForm({ product, isSaving, onSubmit }: Readonly<ProductFormProps>) {
  const form = useForm<ProductFormInput, unknown, ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: toProductFormInput(product),
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => onSubmit(values, (saved) => form.reset(toProductFormInput(saved))))}
        className="grid items-start gap-5 md:grid-cols-[280px_1fr]"
      >
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => <ProductPhoto product={product} image={field.value} onImageChange={field.onChange} />}
        />

        <div className="flex flex-col gap-4 rounded-lg border bg-card p-5 shadow-sm">
          <div className="flex flex-col gap-2">
            <label htmlFor="sku" className="text-sm font-medium">
              SKU
            </label>
            <Input id="sku" value={product.sku} disabled readOnly className="font-mono" />
            <p className="text-xs text-muted-foreground">
              {ITEM_TYPE_LABELS[product.type]} · El código es único y no se puede editar.
            </p>
          </div>

          <ProductFields form={form} />

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="action"
              disabled={!form.formState.isDirty || isSaving}
              onClick={() => form.reset()}
            >
              Descartar cambios
            </Button>
            <Button type="submit" disabled={!form.formState.isDirty || isSaving} variant="accent">
              {isSaving ? "Guardando…" : "Guardar cambios"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
