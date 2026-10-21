import { type UseFormReturn, useWatch } from "react-hook-form"

import {
  BILLING_UNITS,
  productCurrencySchema,
  type ProductFormInput,
  type ProductFormValues,
  SERVICE_MODALITIES,
} from "core/models/product"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "shared/components/ui/form"
import { Input } from "shared/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "shared/components/ui/select"
import { Textarea } from "shared/components/ui/textarea"

import { BILLING_UNIT_LABELS, MODALITY_LABELS } from "./item-labels"

/** Los campos que comparten el perfil del ítem y el modal de creación: los de un producto o los de un servicio, según su tipo. */
export function ProductFields({
  form,
}: Readonly<{ form: UseFormReturn<ProductFormInput, unknown, ProductFormValues> }>) {
  const type = useWatch({ control: form.control, name: "type" })

  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nombre</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descripción</FormLabel>
            <FormControl>
              <Textarea rows={4} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Precio</FormLabel>
              <FormControl>
                <Input type="number" inputMode="decimal" min={0} step="any" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="currency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Moneda</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {productCurrencySchema.options.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {type === "product" ? (
        <div className="grid gap-4 sm:grid-cols-3">
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Talle</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input type="number" inputMode="numeric" min={0} step={1} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <FormField
            control={form.control}
            name="durationMinutes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duración (min)</FormLabel>
                <FormControl>
                  <Input type="number" inputMode="numeric" min={1} step={1} placeholder="Ej: 60" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="modality"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Modalidad</FormLabel>
                <Select value={field.value} items={MODALITY_LABELS} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SERVICE_MODALITIES.map((modality) => (
                      <SelectItem key={modality} value={modality}>
                        {MODALITY_LABELS[modality]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="billingUnit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Se cobra</FormLabel>
                <Select value={field.value} items={BILLING_UNIT_LABELS} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {BILLING_UNITS.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {BILLING_UNIT_LABELS[unit]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </>
  )
}
