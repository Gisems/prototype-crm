import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"

import {
  emptyProductFormInput,
  ITEM_TYPES,
  type ProductFormInput,
  type ProductFormValues,
  productFormSchema,
} from "core/models/product"
import { Button } from "shared/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "shared/components/ui/form"
import { Input } from "shared/components/ui/input"

import { ITEM_TYPE_LABELS } from "../../components/item-labels"
import { ProductFields } from "../../components/product-fields"
import { ProductImagePicker } from "../../components/product-image-picker"

/** `sku-taken` se muestra en el campo SKU; `failed` ya lo avisó quien llama con un toast. */
export type CreateProductResult = "created" | "sku-taken" | "failed"

interface CreateProductFormProps {
  onCreate: (values: ProductFormValues) => Promise<CreateProductResult>
  onCancel: () => void
}

export function CreateProductForm({ onCreate, onCancel }: Readonly<CreateProductFormProps>) {
  const form = useForm<ProductFormInput, unknown, ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: emptyProductFormInput,
  })
  const { isSubmitting } = form.formState
  const name = useWatch({ control: form.control, name: "name" })

  async function onSubmit(values: ProductFormValues) {
    const result = await onCreate(values)

    if (result === "created") onCancel()
    else if (result === "sku-taken") form.setError("sku", { message: "Ya existe un ítem con ese SKU" })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="grid items-start gap-5 md:grid-cols-[220px_1fr]">
          <div className="overflow-hidden rounded-lg border">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <ProductImagePicker image={field.value} alt={name || "Nuevo ítem"} onImageChange={field.onChange} />
              )}
            />
          </div>

          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <div className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
                    {ITEM_TYPES.map((type) => (
                      <button
                        key={type}
                        type="button"
                        aria-pressed={field.value === type}
                        onClick={() => field.onChange(type)}
                        className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                          field.value === type
                            ? "bg-card text-primary shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {ITEM_TYPE_LABELS[type]}
                      </button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SKU</FormLabel>
                  <FormControl>
                    <Input placeholder="VES-FLO-M" autoComplete="off" className="font-mono uppercase" {...field} />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">Código único del ítem. No se puede cambiar después.</p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <ProductFields form={form} />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" size="action" disabled={isSubmitting} onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting} variant="accent">
            {isSubmitting ? "Creando…" : "Crear ítem"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
